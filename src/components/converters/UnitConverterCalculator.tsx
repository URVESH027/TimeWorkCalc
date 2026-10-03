"use client";

import { useState, useMemo } from "react";
import {
  NumberInput,
  ResultCard,
  CopyButton,
  ResetButton,
} from "@/components/calculator";
import {
  decimalHoursToDuration,
  durationToDecimalHours,
  durationToTotalMinutes,
  durationToTotalSeconds,
  totalMinutesToDuration,
  formatDurationFull,
} from "@/lib/time";

type Direction = "hours-to-minutes" | "minutes-to-hours";

interface UnitConverterCalculatorProps {
  direction: Direction;
}

interface ConversionResult {
  primaryValue: string;
  secondaryItems: Array<{ label: string; value: string }>;
  copyText: string;
}

interface ConverterConfig {
  label: string;
  placeholder: string;
  step: number;
  emptyMessage: string;
  convert: (raw: string) => ConversionResult | null;
}

function parseNonNegativeNumber(raw: string): number | null {
  if (raw.trim() === "") return null;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

function formatMinutes(totalMinutes: number): string {
  const rounded = Math.round(totalMinutes * 100) / 100;
  return `${rounded} minute${rounded === 1 ? "" : "s"}`;
}

function convertHoursToMinutes(raw: string): ConversionResult | null {
  const hours = parseNonNegativeNumber(raw);
  if (hours === null) return null;

  const duration = decimalHoursToDuration(hours);
  const minutesText = formatMinutes(durationToTotalMinutes(duration));
  const hoursText = `${hours} hour${hours === 1 ? "" : "s"}`;
  const durationText = formatDurationFull(duration);

  return {
    primaryValue: minutesText,
    secondaryItems: [
      { label: "Hours and minutes", value: durationText },
      { label: "Total seconds", value: `${durationToTotalSeconds(duration)} seconds` },
    ],
    copyText: `${hoursText} = ${minutesText} = ${durationText}`,
  };
}

function convertMinutesToHours(raw: string): ConversionResult | null {
  const minutes = parseNonNegativeNumber(raw);
  if (minutes === null) return null;

  const duration = totalMinutesToDuration(minutes);
  const decimal = durationToDecimalHours(duration);
  const minutesText = formatMinutes(minutes);
  const durationText = formatDurationFull(duration);
  const decimalText = `${decimal} hour${decimal === 1 ? "" : "s"}`;

  return {
    primaryValue: durationText,
    secondaryItems: [
      { label: "Decimal hours", value: decimalText },
      { label: "Total minutes", value: minutesText },
    ],
    copyText: `${minutesText} = ${durationText} = ${decimalText}`,
  };
}

const INPUT_CONFIG: Record<Direction, ConverterConfig> = {
  "hours-to-minutes": {
    label: "Hours",
    placeholder: "2.5",
    step: 0.01,
    emptyMessage: "Enter hours to convert to minutes.",
    convert: convertHoursToMinutes,
  },
  "minutes-to-hours": {
    label: "Minutes",
    placeholder: "90",
    step: 1,
    emptyMessage: "Enter minutes to convert to hours.",
    convert: convertMinutesToHours,
  },
};

export function UnitConverterCalculator({
  direction,
}: UnitConverterCalculatorProps) {
  const config = INPUT_CONFIG[direction];
  const [value, setValue] = useState("");

  const result = useMemo(() => config.convert(value), [config, value]);

  const reset = () => setValue("");

  return (
    <div className="grid items-start gap-4 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
      <NumberInput
        label={config.label}
        value={value}
        onChange={setValue}
        placeholder={config.placeholder}
        min={0}
        step={config.step}
      />

      <div className="flex flex-col gap-3">
        {result ? (
          <ResultCard
            primaryLabel="Result"
            primaryValue={result.primaryValue}
            secondaryItems={result.secondaryItems}
          />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
            {config.emptyMessage}
          </div>
        )}

        {result && (
          <div className="flex gap-2">
            <CopyButton text={result.copyText} />
            <ResetButton onClick={reset} />
          </div>
        )}
      </div>
    </div>
  );
}
