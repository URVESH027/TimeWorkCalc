"use client";

import { useState, useMemo } from "react";
import { NumberInput, ResultCard, CopyButton, ResetButton } from "@/components/calculator";
import {
  durationToDecimalHours,
  decimalHoursToDuration,
  durationToTotalMinutes,
  formatDurationFull,
} from "@/lib/time";
import type { Duration } from "@/types/time";

type Direction = "toDecimal" | "fromDecimal";

function durationFromInputs(h: string, m: string): Duration {
  const hours = parseInt(h) || 0;
  const minutes = parseInt(m) || 0;
  return { hours, minutes, seconds: 0 };
}

export function DecimalHoursCalculator() {
  const [direction, setDirection] = useState<Direction>("toDecimal");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [decimalValue, setDecimalValue] = useState("");

  const result = useMemo(() => {
    if (direction === "toDecimal") {
      if (!hours.trim() && !minutes.trim()) return null;
      const dur = durationFromInputs(hours, minutes);
      if (dur.hours === 0 && dur.minutes === 0) return null;
      const decimal = durationToDecimalHours(dur);
      return {
        duration: dur,
        decimal,
        formattedDuration: formatDurationFull(dur),
      };
    } else {
      if (!decimalValue.trim()) return null;
      const val = parseFloat(decimalValue);
      if (isNaN(val) || val < 0) return null;
      const dur = decimalHoursToDuration(val);
      const roundTrip = durationToDecimalHours(dur);
      return {
        duration: dur,
        decimal: roundTrip,
        formattedDuration: formatDurationFull(dur),
      };
    }
  }, [direction, hours, minutes, decimalValue]);

  const reset = () => {
    setHours("");
    setMinutes("");
    setDecimalValue("");
  };

  const copyText = result
    ? `${result.formattedDuration} = ${result.decimal.toFixed(2)} decimal hours`
    : "";

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="group" aria-label="Conversion direction">
        {([
          { key: "toDecimal", label: "HH:MM → Decimal" },
          { key: "fromDecimal", label: "Decimal → HH:MM" },
        ] as const).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => { setDirection(opt.key); reset(); }}
            aria-pressed={direction === opt.key}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              direction === opt.key
                ? "bg-blue-600 text-white"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2">
        <div className="max-w-md">
          {direction === "toDecimal" ? (
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Hours" value={hours} onChange={setHours} placeholder="7" min={0} />
              <NumberInput label="Minutes" value={minutes} onChange={setMinutes} placeholder="30" min={0} max={59} />
            </div>
          ) : (
            <NumberInput
              label="Decimal hours"
              value={decimalValue}
              onChange={setDecimalValue}
              placeholder="7.5"
              min={0}
              step={0.01}
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          {result && (
            <ResultCard
              primaryLabel="Result"
              primaryValue={`${result.decimal.toFixed(2)} decimal hours`}
              secondaryItems={[
                { label: "Duration", value: result.formattedDuration },
                { label: "Minutes", value: `${Math.round(durationToTotalMinutes(result.duration))} minutes` },
              ]}
            />
          )}

          {result && (
            <div className="flex gap-2">
              <CopyButton text={copyText} />
              <ResetButton onClick={reset} />
            </div>
          )}

          {!result && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
              Enter a value to convert between hours/minutes and decimal hours.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
