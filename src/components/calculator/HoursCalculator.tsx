"use client";

import { useState, useMemo } from "react";
import { TimeInput, ResultCard, CopyButton, ResetButton } from "@/components/calculator";
import {
  parseClockTime,
  timeDifference,
  formatDurationFull,
} from "@/lib/time";

export function HoursCalculator() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [overnight, setOvernight] = useState(false);

  const result = useMemo(() => {
    if (!start.trim() || !end.trim()) return null;

    const startParsed = parseClockTime(start.trim());
    const endParsed = parseClockTime(end.trim());

    if (!startParsed.ok) {
      return { ok: false as const, error: startParsed.error };
    }
    if (!endParsed.ok) {
      return { ok: false as const, error: endParsed.error };
    }

    return timeDifference(startParsed.value, endParsed.value, overnight);
  }, [start, end, overnight]);

  const reset = () => {
    setStart("");
    setEnd("");
    setOvernight(false);
  };

  const worked = result?.ok ? result.value.duration : null;
  const decimalHours = result?.ok ? result.value.decimalHours : null;
  const totalMinutes = result?.ok ? result.value.totalMinutes : null;
  const errorMsg = result && !result.ok ? result.error.message : null;
  const showOvernightHint = !overnight && start.trim() !== "" && end.trim() !== "" && !!errorMsg;

  const copyText = useMemo(() => {
    if (!worked || !decimalHours) return "";
    return `${formatDurationFull(worked)} (${decimalHours.toFixed(2)} hours)`;
  }, [worked, decimalHours]);

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TimeInput
            label="Start time"
            value={start}
            onChange={setStart}
            placeholder="8:30 AM"
            required
          />
          <TimeInput
            label="End time"
            value={end}
            onChange={setEnd}
            placeholder="5:30 PM"
            required
          />
        </div>

        <label
          htmlFor="overnight"
          className="-mx-1 flex min-h-11 cursor-pointer items-center gap-2 rounded px-1 text-sm text-zinc-700"
        >
          <input
            id="overnight"
            type="checkbox"
            checked={overnight}
            onChange={(e) => setOvernight(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          Overnight shift (crosses midnight)
        </label>

        {showOvernightHint && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700" role="status">
            Does your shift cross midnight? Enable &quot;Overnight shift&quot; above.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {errorMsg}
          </div>
        )}

        {worked && (
          <ResultCard
            primaryLabel="Elapsed time"
            primaryValue={formatDurationFull(worked)}
            secondaryItems={[
              { label: "Decimal hours", value: `${decimalHours?.toFixed(2)} hours` },
              { label: "Total minutes", value: `${totalMinutes} minutes` },
            ]}
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
            Enter start and end times to calculate elapsed time.
          </div>
        )}
      </div>
    </div>
  );
}
