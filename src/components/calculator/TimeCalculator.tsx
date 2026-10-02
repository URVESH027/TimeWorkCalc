"use client";

import { useState, useMemo } from "react";
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

function parseDuration(hours: string, minutes: string, seconds: string): Duration {
  const h = parseInt(hours) || 0;
  const m = parseInt(minutes) || 0;
  const s = parseInt(seconds) || 0;
  return { hours: h, minutes: m, seconds: s };
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

  const result = useMemo(() => {
    const a = parseDuration(aHours, aMinutes, aSeconds);

    if (operation === "multiply") {
      const factor = parseFloat(multiplyBy);
      if (isNaN(factor) || multiplyBy.trim() === "") return null;
      return multiplyDuration(a, factor);
    }

    const b = parseDuration(bHours, bMinutes, bSeconds);
    const isEmpty = b.hours === 0 && b.minutes === 0 && b.seconds === 0;
    if (isEmpty) return null;

    return operation === "add" ? addDurations(a, b) : subtractDuration(a, b);
  }, [operation, aHours, aMinutes, aSeconds, bHours, bMinutes, bSeconds, multiplyBy]);

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
    <div className="space-y-6">
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

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700">
          {operation === "multiply" ? "Duration" : "First duration"}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="Hours" value={aHours} onChange={setAHours} placeholder="0" min={0} />
          <NumberInput label="Minutes" value={aMinutes} onChange={setAMinutes} placeholder="0" min={0} max={59} />
          <NumberInput label="Seconds" value={aSeconds} onChange={setASeconds} placeholder="0" min={0} max={59} />
        </div>
      </div>

      {operation !== "multiply" && (
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">Second duration</p>
          <div className="grid grid-cols-3 gap-3">
            <NumberInput label="Hours" value={bHours} onChange={setBHours} placeholder="0" min={0} />
            <NumberInput label="Minutes" value={bMinutes} onChange={setBMinutes} placeholder="0" min={0} max={59} />
            <NumberInput label="Seconds" value={bSeconds} onChange={setBSeconds} placeholder="0" min={0} max={59} />
          </div>
        </div>
      )}

      {operation === "multiply" && (
        <div>
          <NumberInput
            label="Multiply by"
            value={multiplyBy}
            onChange={setMultiplyBy}
            placeholder="2"
            min={0}
            step={0.1}
          />
        </div>
      )}

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

      {!result && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
          Enter durations to perform time arithmetic.
        </div>
      )}
    </div>
  );
}
