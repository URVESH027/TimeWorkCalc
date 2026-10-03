"use client";

import { useState } from "react";
import { NumberInput, ResultCard, CopyButton, ResetButton } from "@/components/calculator";
import {
  addDurations,
  subtractDuration,
  multiplyDuration,
  durationToDecimalHours,
  formatDurationFull,
} from "@/lib/time";
import type { Duration } from "@/types/time";

type Operation = "add" | "subtract" | "multiply";

interface ParsedField {
  value: number;
  error: string | null;
}

/**
 * Parse a duration component (hours/minutes/seconds) with validation.
 *
 * Empty input is treated as 0 (existing empty-state behavior). Invalid,
 * negative, fractional, or out-of-range input produces a field error —
 * it is never silently coerced to 0.
 */
function parseIntegerField(raw: string, label: string, max?: number): ParsedField {
  const trimmed = raw.trim();
  if (trimmed === "") return { value: 0, error: null };

  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) {
    return { value: 0, error: `${label} must be a number of 0 or greater.` };
  }
  if (!Number.isInteger(n)) {
    return { value: 0, error: `${label} must be a whole number.` };
  }
  if (max !== undefined && n > max) {
    return { value: 0, error: `${label} must be between 0 and ${max}.` };
  }
  return { value: n, error: null };
}

/**
 * Parse the multiply factor (may be fractional). Empty stays empty so the
 * existing empty state is preserved; invalid input produces a field error.
 */
function parseFactor(raw: string): { value: number | null; error: string | null } {
  const trimmed = raw.trim();
  if (trimmed === "") return { value: null, error: null };

  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) {
    return { value: null, error: "Multiply by must be a number of 0 or greater." };
  }
  return { value: n, error: null };
}

export function TimeCalculator() {
  const [operation, setOperation] = useState<Operation>("add");
  const [aHours, setAHours] = useState("");
  const [aMinutes, setAMinutes] = useState("");
  const [aSeconds, setASeconds] = useState("");
  const [bHours, setBHours] = useState("");
  const [bMinutes, setBMinutes] = useState("");
  const [bSeconds, setBSeconds] = useState("");
  const [multiplyBy, setMultiplyBy] = useState("");

  const aH = parseIntegerField(aHours, "First duration: hours");
  const aM = parseIntegerField(aMinutes, "First duration: minutes", 59);
  const aS = parseIntegerField(aSeconds, "First duration: seconds", 59);

  const showSecondDuration = operation !== "multiply";
  const bH = showSecondDuration ? parseIntegerField(bHours, "Second duration: hours") : null;
  const bM = showSecondDuration ? parseIntegerField(bMinutes, "Second duration: minutes", 59) : null;
  const bS = showSecondDuration ? parseIntegerField(bSeconds, "Second duration: seconds", 59) : null;

  const factor = operation === "multiply" ? parseFactor(multiplyBy) : null;

  const fieldErrors = [
    aH.error,
    aM.error,
    aS.error,
    bH?.error,
    bM?.error,
    bS?.error,
    factor?.error,
  ].filter((e): e is string => Boolean(e));

  const hasError = fieldErrors.length > 0;

  let result: Duration | null = null;
  if (!hasError) {
    const a: Duration = { hours: aH.value, minutes: aM.value, seconds: aS.value };

    if (operation === "multiply") {
      if (factor && factor.value !== null) {
        result = multiplyDuration(a, factor.value);
      }
    } else if (bH && bM && bS) {
      const b: Duration = { hours: bH.value, minutes: bM.value, seconds: bS.value };
      const isEmpty = b.hours === 0 && b.minutes === 0 && b.seconds === 0;
      if (!isEmpty) {
        result = operation === "add" ? addDurations(a, b) : subtractDuration(a, b);
      }
    }
  }

  const reset = () => {
    setAHours("");
    setAMinutes("");
    setASeconds("");
    setBHours("");
    setBMinutes("");
    setBSeconds("");
    setMultiplyBy("");
    setOperation("add");
  };

  const decimalHours = result ? durationToDecimalHours(result) : null;
  const copyText = result ? formatDurationFull(result) : "";

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="group" aria-label="Operation">
        {(["add", "subtract", "multiply"] as const).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperation(op)}
            aria-pressed={operation === op}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              operation === op
                ? "bg-blue-600 text-white"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {op === "add" ? "Add" : op === "subtract" ? "Subtract" : "Multiply"}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-700">
              {operation === "multiply" ? "Duration" : "First duration"}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <NumberInput label="Hours" value={aHours} onChange={setAHours} placeholder="0" min={0} error={aH.error ?? undefined} />
              <NumberInput label="Minutes" value={aMinutes} onChange={setAMinutes} placeholder="0" min={0} max={59} error={aM.error ?? undefined} />
              <NumberInput label="Seconds" value={aSeconds} onChange={setASeconds} placeholder="0" min={0} max={59} error={aS.error ?? undefined} />
            </div>
          </div>

          {operation !== "multiply" && (
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">Second duration</p>
              <div className="grid grid-cols-3 gap-3">
                <NumberInput label="Hours" value={bHours} onChange={setBHours} placeholder="0" min={0} error={bH?.error ?? undefined} />
                <NumberInput label="Minutes" value={bMinutes} onChange={setBMinutes} placeholder="0" min={0} max={59} error={bM?.error ?? undefined} />
                <NumberInput label="Seconds" value={bSeconds} onChange={setBSeconds} placeholder="0" min={0} max={59} error={bS?.error ?? undefined} />
              </div>
            </div>
          )}

          {operation === "multiply" && (
            <div className="max-w-[16rem]">
              <NumberInput
                label="Multiply by"
                value={multiplyBy}
                onChange={setMultiplyBy}
                placeholder="2"
                min={0}
                step={0.1}
                error={factor?.error ?? undefined}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {result && (
            <ResultCard
              primaryLabel="Result"
              primaryValue={formatDurationFull(result)}
              secondaryItems={[
                { label: "Decimal hours", value: `${decimalHours?.toFixed(2)} hours` },
                { label: "Short format", value: `${result.hours}h ${result.minutes}m${result.seconds > 0 ? ` ${result.seconds}s` : ""}` },
              ]}
            />
          )}

          {result && (
            <div className="flex gap-2">
              <CopyButton text={copyText} />
              <ResetButton onClick={reset} />
            </div>
          )}

          {!result && !hasError && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
              Enter durations to perform time arithmetic.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
