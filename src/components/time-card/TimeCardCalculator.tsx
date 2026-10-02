"use client";

import { useState, useCallback, useMemo } from "react";
import { TimeInput, BreakInput, CopyButton, ResetButton } from "@/components/calculator";
import {
  parseClockTime,
  calculateWorkHours,
  calculateMultiDayTotals,
  toMinutesSinceMidnight,
  durationToTotalMinutes,
  durationToDecimalHours,
  formatDurationFull,
  formatDurationShort,
} from "@/lib/time";
import type { ClockTime, WorkHoursResult, EngineResult, DayEntry } from "@/types/time";

interface DayRow {
  id: string;
  clockIn: string;
  clockOut: string;
  breakMin: string;
  result: EngineResult<WorkHoursResult> | null;
}

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function createEmptyDay(id: string): DayRow {
  return { id, clockIn: "", clockOut: "", breakMin: "", result: null };
}

function parseInput(timeStr: string): ClockTime | null {
  if (!timeStr.trim()) return null;
  const result = parseClockTime(timeStr.trim());
  return result.ok ? result.value : null;
}

function calculateDay(row: DayRow): EngineResult<WorkHoursResult> | null {
  const clockIn = parseInput(row.clockIn);
  const clockOut = parseInput(row.clockOut);

  if (!clockIn || !clockOut) return null;

  const breakMin = row.breakMin.trim() === "" ? 0 : parseInt(row.breakMin, 10);
  const breaks = breakMin > 0 ? [breakMin] : [];

  return calculateWorkHours(clockIn, clockOut, breaks);
}

export function TimeCardCalculator() {
  const [days, setDays] = useState<DayRow[]>(() =>
    DAY_NAMES.map((_, i) => createEmptyDay(`day-${i}`)),
  );
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4]);

  const addDay = useCallback(() => {
    setActiveDays((prev) => {
      const nextAvailable = Array.from({ length: 7 }, (_, i) => i).find(
        (i) => !prev.includes(i),
      );
      if (nextAvailable === undefined) return prev;
      return [...prev, nextAvailable].sort();
    });
  }, []);

  const removeDay = useCallback((dayIndex: number) => {
    setActiveDays((prev) => prev.filter((i) => i !== dayIndex));
    setDays((prev) =>
      prev.map((d, i) => (i === dayIndex ? createEmptyDay(d.id) : d)),
    );
  }, []);

  const updateDay = useCallback(
    (dayIndex: number, field: keyof DayRow, value: string) => {
      setDays((prev) => {
        const updated = prev.map((d, i) => {
          if (i !== dayIndex) return d;
          const newDay = { ...d, [field]: value };
          newDay.result = calculateDay(newDay);
          return newDay;
        });
        return updated;
      });
    },
    [],
  );

  const copyFirstRow = useCallback(() => {
    const firstActive = activeDays[0];
    if (firstActive === undefined) return;
    const first = days[firstActive];
    if (!first.clockIn.trim() && !first.clockOut.trim()) return;
    setDays((prev) =>
      prev.map((d, i) => {
        if (!activeDays.includes(i) || i === firstActive) return d;
        const updated = { ...d, clockIn: first.clockIn, clockOut: first.clockOut, breakMin: first.breakMin };
        updated.result = calculateDay(updated);
        return updated;
      }),
    );
  }, [activeDays, days]);

  const resetAll = useCallback(() => {
    setDays(DAY_NAMES.map((_, i) => createEmptyDay(`day-${i}`)));
    setActiveDays([0, 1, 2, 3, 4]);
  }, []);

  const totals = useMemo(() => {
    const activeEntries = activeDays.map((i) => days[i]);
    const hasData = activeEntries.some(
      (d) => d.clockIn.trim() !== "" && d.clockOut.trim() !== "",
    );
    if (!hasData) return null;

    const engineEntries: DayEntry[] = activeEntries
      .filter((d) => d.clockIn.trim() !== "" && d.clockOut.trim() !== "" && d.result?.ok)
      .map((d) => {
        const breakMin = d.breakMin.trim() === "" ? 0 : parseInt(d.breakMin, 10);
        const clockIn = parseInput(d.clockIn)!;
        const clockOut = parseInput(d.clockOut)!;
        const breaks = breakMin > 0 ? [breakMin] : [];
        return { clockIn, clockOut, breaks } as DayEntry;
      });

    if (engineEntries.length === 0) return null;

    const multiDayResult = calculateMultiDayTotals(engineEntries);
    if (!multiDayResult.ok) return null;

    const totalMinutes = Math.round(durationToTotalMinutes(multiDayResult.value.totalWorked));

    return {
      worked: multiDayResult.value.totalWorked,
      break: multiDayResult.value.totalBreak,
      elapsed: multiDayResult.value.totalElapsed,
      decimalHours: multiDayResult.value.totalDecimalHours,
      minutes: totalMinutes,
    };
  }, [days, activeDays]);

  const copyText = useMemo(() => {
    if (!totals) return "";
    const lines: string[] = [];
    for (const dayIndex of activeDays) {
      const row = days[dayIndex];
      if (!row.clockIn.trim() || !row.clockOut.trim()) continue;
      if (!row.result?.ok) continue;
      const worked = row.result.value.worked;
      const dec = durationToDecimalHours(worked);
      const breakMin = row.breakMin.trim() === "" ? 0 : parseInt(row.breakMin, 10);
      lines.push(
        `${DAY_NAMES[dayIndex]}: ${row.clockIn} - ${row.clockOut}${breakMin > 0 ? ` (${breakMin}m break)` : ""} = ${formatDurationShort(worked)} (${dec.toFixed(2)}h)`,
      );
    }
    lines.push("");
    lines.push(`Week Total: ${formatDurationFull(totals.worked)} (${totals.decimalHours.toFixed(2)} hours)`);
    lines.push(`Total Break: ${formatDurationFull(totals.break)}`);
    return lines.join("\n");
  }, [totals, days, activeDays]);

  return (
    <div className="space-y-6">
      {activeDays.map((dayIndex) => {
        const row = days[dayIndex];
        const dayName = DAY_NAMES[dayIndex];
        const worked = row.result?.ok ? row.result.value.worked : null;
        const errorMsg = !row.result?.ok && row.result ? row.result.error.message : null;
        const isOvernight =
          row.clockIn.trim() !== "" &&
          row.clockOut.trim() !== "" &&
          row.result?.ok &&
          row.result.value.elapsed.hours > 0 &&
          parseInput(row.clockIn) &&
          parseInput(row.clockOut) &&
          (() => {
            const ci = parseInput(row.clockIn)!;
            const co = parseInput(row.clockOut)!;
            const ciMin = toMinutesSinceMidnight(ci);
            const coMin = toMinutesSinceMidnight(co);
            return coMin < ciMin;
          })();

        return (
          <div key={row.id} className="rounded-lg border border-zinc-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">{dayName}</h2>
              {activeDays.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="min-h-[44px] min-w-[44px] rounded p-2 text-sm text-zinc-500 hover:text-red-600"
                  aria-label={`Remove ${dayName}`}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <TimeInput
                label="Clock in"
                value={row.clockIn}
                onChange={(v) => updateDay(dayIndex, "clockIn", v)}
                placeholder="9:00 AM"
              />
              <TimeInput
                label="Clock out"
                value={row.clockOut}
                onChange={(v) => updateDay(dayIndex, "clockOut", v)}
                placeholder="5:30 PM"
              />
              <BreakInput
                value={row.breakMin}
                onChange={(v) => updateDay(dayIndex, "breakMin", v)}
              />
              <div className="flex items-end">
                {worked && (
                  <div className="w-full rounded-md bg-blue-50 px-3 py-2.5 text-center">
                    <span className="text-lg font-semibold tabular-nums text-blue-700">
                      {formatDurationShort(worked)}
                    </span>
                    <span className="mt-0.5 block text-xs tabular-nums text-blue-600">
                      {durationToDecimalHours(worked).toFixed(2)}h
                    </span>
                    {isOvernight && (
                      <span className="mt-0.5 block text-xs text-blue-600">
                        overnight
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {errorMsg}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2">
        {activeDays.length < 7 && (
          <button
            type="button"
            onClick={addDay}
            className="flex-1 rounded-lg border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700 sm:flex-none sm:px-4"
          >
            + Add day
          </button>
        )}
        {activeDays.length > 1 && (
          <button
            type="button"
            onClick={copyFirstRow}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Copy first row to all
          </button>
        )}
      </div>

      {totals && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 text-sm font-medium text-blue-700">
            Week Total
          </div>
          <div className="text-3xl font-bold tabular-nums text-blue-900">
            {formatDurationFull(totals.worked)}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <span className="text-blue-600">Decimal hours</span>
              <p className="font-semibold tabular-nums text-blue-900">
                {totals.decimalHours.toFixed(2)} hours
              </p>
            </div>
            <div>
              <span className="text-blue-600">Total minutes</span>
              <p className="font-semibold tabular-nums text-blue-900">
                {totals.minutes} minutes
              </p>
            </div>
            <div>
              <span className="text-blue-600">Total break</span>
              <p className="font-semibold tabular-nums text-blue-900">
                {formatDurationFull(totals.break)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <CopyButton text={copyText} />
            <ResetButton onClick={resetAll} />
          </div>
        </div>
      )}

      {!totals && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
          Enter clock-in and clock-out times to see your total.
        </div>
      )}
    </div>
  );
}
