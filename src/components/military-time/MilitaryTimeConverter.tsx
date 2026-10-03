"use client";

import { useState, useCallback } from "react";
import {
  TimeInput,
  ResultCard,
  CopyButton,
  ResetButton,
} from "@/components/calculator";
import {
  parseMilitaryTime,
  toTimeRepresentations,
} from "@/lib/time/military-time";
import type { TimeRepresentations } from "@/lib/time/military-time";

function buildCopyText(representations: TimeRepresentations): string {
  return [
    `Military time: ${representations.military}`,
    `24-hour time: ${representations.hour24}`,
    `12-hour time: ${representations.hour12}`,
  ].join("\n");
}

export function MilitaryTimeConverter() {
  const [value, setValue] = useState("");

  const reset = useCallback(() => setValue(""), []);

  const trimmed = value.trim();
  const parsed = trimmed === "" ? null : parseMilitaryTime(trimmed);
  const errorMsg =
    parsed !== null && !parsed.ok ? parsed.error.message : null;
  const representations =
    parsed !== null && parsed.ok ? toTimeRepresentations(parsed.value) : null;

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <TimeInput
          label="Time"
          value={value}
          onChange={setValue}
          placeholder="14:30, 1430, or 2:30 PM"
          required
        />
        <p className="text-xs text-zinc-500">
          Auto-detects military (1430), 24-hour (14:30), and 12-hour (2:30 PM)
          formats.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {errorMsg && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMsg}
          </div>
        )}

        {representations && (
          <ResultCard
            primaryLabel="Military time"
            primaryValue={representations.military}
            secondaryItems={[
              { label: "24-hour time", value: representations.hour24 },
              { label: "12-hour time", value: representations.hour12 },
            ]}
          />
        )}

        {representations && (
          <div className="flex gap-2">
            <CopyButton text={buildCopyText(representations)} />
            <ResetButton onClick={reset} />
          </div>
        )}

        {!trimmed && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
            Enter a time to see the military, 24-hour, and 12-hour versions.
          </div>
        )}
      </div>
    </div>
  );
}
