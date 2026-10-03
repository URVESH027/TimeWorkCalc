"use client";

import { useState, useCallback, useMemo } from "react";
import { TimeInput, BreakInput, ResultCard, CopyButton, ResetButton } from "@/components/calculator";
import {
  parseClockTime,
  calculateWorkHours,
  formatDurationFull,
  durationToTotalMinutes,
} from "@/lib/time";
import type { WorkHoursResult, EngineResult } from "@/types/time";

export function WorkHoursCalculator() {
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [breakMin, setBreakMin] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [showPay, setShowPay] = useState(false);
  const [result, setResult] = useState<EngineResult<WorkHoursResult> | null>(null);

  const autoCalc = useCallback(() => {
    if (clockIn.trim() && clockOut.trim()) {
      const inParsed = parseClockTime(clockIn.trim());
      const outParsed = parseClockTime(clockOut.trim());
      if (inParsed.ok && outParsed.ok) {
        const breaks = breakMin.trim() !== "" ? [parseInt(breakMin, 10)] : [];
        setResult(calculateWorkHours(inParsed.value, outParsed.value, breaks));
        return;
      }
      if (!inParsed.ok) {
        setResult({ ok: false, error: inParsed.error });
        return;
      }
      if (!outParsed.ok) {
        setResult({ ok: false, error: outParsed.error });
        return;
      }
    }
    setResult(null);
  }, [clockIn, clockOut, breakMin]);

  // Auto-calculate on any input change
  useMemo(() => {
    autoCalc();
  }, [autoCalc]);

  const worked = result?.ok ? result.value.worked : null;
  const decimalHours = result?.ok ? result.value.decimalHours : null;
  const totalMinutes = worked ? Math.floor(durationToTotalMinutes(worked)) : null;
  const errorMsg = result && !result.ok ? result.error.message : null;
  const totalBreak = result?.ok ? result.value.totalBreak : null;

  const pay = useMemo(() => {
    if (!decimalHours || !hourlyRate.trim()) return null;
    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate < 0) return null;
    return decimalHours * rate;
  }, [decimalHours, hourlyRate]);

  const copyText = useMemo(() => {
    if (!worked || !decimalHours) return "";
    const lines = [
      `Worked: ${formatDurationFull(worked)} (${decimalHours.toFixed(2)} hours)`,
    ];
    if (totalBreak && (totalBreak.hours > 0 || totalBreak.minutes > 0)) {
      lines.push(`Break: ${formatDurationFull(totalBreak)}`);
    }
    if (pay !== null) {
      lines.push(`Pay: $${pay.toFixed(2)}`);
    }
    return lines.join("\n");
  }, [worked, decimalHours, totalBreak, pay]);

  const reset = () => {
    setClockIn("");
    setClockOut("");
    setBreakMin("");
    setHourlyRate("");
    setShowPay(false);
    setResult(null);
  };

  const secondaryItems = useMemo(() => {
    const items: Array<{ label: string; value: string }> = [];
    if (decimalHours !== null) {
      items.push({ label: "Decimal hours", value: `${decimalHours.toFixed(2)} hours` });
    }
    if (totalMinutes !== null) {
      items.push({ label: "Total minutes", value: `${totalMinutes} minutes` });
    }
    if (totalBreak && (totalBreak.hours > 0 || totalBreak.minutes > 0)) {
      items.push({ label: "Break", value: formatDurationFull(totalBreak) });
    }
    if (pay !== null) {
      items.push({ label: "Estimated pay", value: `$${pay.toFixed(2)}` });
    }
    return items;
  }, [decimalHours, totalMinutes, totalBreak, pay]);

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TimeInput
            label="Clock in"
            value={clockIn}
            onChange={setClockIn}
            placeholder="9:00 AM"
            required
          />
          <TimeInput
            label="Clock out"
            value={clockOut}
            onChange={setClockOut}
            placeholder="5:30 PM"
            required
          />
          <BreakInput value={breakMin} onChange={setBreakMin} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label
            htmlFor="show-pay"
            className="-mx-1 flex min-h-11 cursor-pointer items-center gap-2 rounded px-1 text-sm text-zinc-700"
          >
            <input
              id="show-pay"
              type="checkbox"
              checked={showPay}
              onChange={(e) => {
                setShowPay(e.target.checked);
                if (!e.target.checked) setHourlyRate("");
              }}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            Calculate pay estimate
          </label>
          {showPay && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="hourly-rate"
                className="text-sm text-zinc-700"
              >
                Hourly rate ($)
              </label>
              <input
                id="hourly-rate"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="15.00"
                className="w-32 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {errorMsg}
          </div>
        )}

        {worked && (
          <ResultCard
            primaryLabel="Worked time"
            primaryValue={formatDurationFull(worked)}
            secondaryItems={secondaryItems}
          />
        )}

        {worked && (
          <div className="flex gap-2">
            <CopyButton text={copyText} />
            <ResetButton onClick={reset} />
          </div>
        )}

        {!worked && !errorMsg && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
            Enter clock-in and clock-out times to calculate worked hours.
          </div>
        )}
      </div>
    </div>
  );
}
