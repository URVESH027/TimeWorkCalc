"use client";

import { useState, useCallback } from "react";
import { ResultCard, CopyButton, ResetButton } from "@/components/calculator";
import {
  decimalHoursToDuration,
  addDurations,
  durationToDecimalHours,
  durationToTotalMinutes,
  formatDurationShort,
} from "@/lib/time";
import type { Duration } from "@/types/time";

const DAYS = [
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
  { short: "Sun", full: "Sunday" },
] as const;

type Values = Record<string, string>;

function emptyValues(): Values {
  return Object.fromEntries(DAYS.map((d) => [d.full, ""]));
}

type Analysis =
  | { status: "empty" }
  | { status: "invalid"; message: string }
  | {
      status: "ok";
      duration: Duration;
      decimalHours: number;
      totalMinutes: number;
    };

function analyze(values: Values): Analysis {
  const entered: number[] = [];

  for (const day of DAYS) {
    const raw = values[day.full].trim();
    if (raw === "") continue;

    const hours = Number.parseFloat(raw);
    if (!Number.isFinite(hours) || hours < 0) {
      return {
        status: "invalid",
        message: "Hours must be a number of 0 or greater.",
      };
    }

    entered.push(hours);
  }

  if (entered.length === 0) return { status: "empty" };

  const total = entered.reduce<Duration>(
    (acc, hours) => addDurations(acc, decimalHoursToDuration(hours)),
    { hours: 0, minutes: 0, seconds: 0 },
  );

  return {
    status: "ok",
    duration: total,
    decimalHours: durationToDecimalHours(total),
    totalMinutes: Math.round(durationToTotalMinutes(total)),
  };
}

function buildCopyText(values: Values, analysis: Analysis): string {
  if (analysis.status !== "ok") return "";
  const lines: string[] = [];
  for (const day of DAYS) {
    const raw = values[day.full].trim();
    if (raw === "") continue;
    const hours = Number.parseFloat(raw);
    lines.push(`${day.full}: ${hours} hour${hours === 1 ? "" : "s"}`);
  }
  const h = analysis.decimalHours;
  lines.push(`Weekly Total: ${h} hour${h === 1 ? "" : "s"}`);
  return lines.join("\n");
}

export function TimesheetCalculator() {
  const [values, setValues] = useState<Values>(emptyValues);

  const setValue = useCallback((day: string, value: string) => {
    setValues((prev) => ({ ...prev, [day]: value }));
  }, []);

  const reset = useCallback(() => setValues(emptyValues()), []);

  const analysis = analyze(values);
  const copyText = buildCopyText(values, analysis);

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-medium text-zinc-700">Daily hours</p>
        <div className="flex flex-col gap-2">
          {DAYS.map((day) => (
            <div key={day.full} className="flex items-center gap-3">
              <label
                htmlFor={`hours-${day.full}`}
                className="w-12 shrink-0 text-sm font-medium text-zinc-700"
              >
                {day.short}
              </label>
              <input
                id={`hours-${day.full}`}
                type="number"
                inputMode="decimal"
                min={0}
                step={0.25}
                value={values[day.full]}
                onChange={(e) => setValue(day.full, e.target.value)}
                placeholder="0"
                aria-label={day.full}
                className="w-28 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {analysis.status === "invalid" && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {analysis.message}
          </div>
        )}

        {analysis.status === "ok" && (
          <ResultCard
            primaryLabel="Weekly total"
            primaryValue={formatDurationShort(analysis.duration)}
            secondaryItems={[
              {
                label: "Decimal hours",
                value: `${analysis.decimalHours} hour${analysis.decimalHours === 1 ? "" : "s"}`,
              },
              {
                label: "Total minutes",
                value: `${analysis.totalMinutes} minute${analysis.totalMinutes === 1 ? "" : "s"}`,
              },
            ]}
          />
        )}

        {analysis.status === "ok" && (
          <div className="flex gap-2">
            <CopyButton text={copyText} />
            <ResetButton onClick={reset} />
          </div>
        )}

        {analysis.status === "empty" && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
            Enter hours worked each day to see your weekly total.
          </div>
        )}
      </div>
    </div>
  );
}
