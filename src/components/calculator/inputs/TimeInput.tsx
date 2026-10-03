"use client";

import { useId, useState } from "react";
import { parseClockTime, to24Hour } from "@/lib/time";

type PeriodSelection = "" | "AM" | "PM";

/**
 * Rewrite a time string when the user picks a value in the AM/PM selector.
 *
 * The text field's string is the single source of truth; this helper only
 * produces the next string value (no separate period state exists).
 *
 * - ""        → remove AM/PM by converting to 24-hour "HH:MM" (same instant)
 * - "AM"/"PM" → set the period on a 1-12 hour value (inserting ":00" when
 *               minutes are missing, e.g. "6" + PM → "6:00 PM")
 * - Out-of-range hours use the instant-preserving 12-hour form where one
 *   exists ("18:00" + PM → "6:00 PM", "00:30" + AM → "12:30 AM").
 * - Selections with no valid representation are ignored (original text is
 *   returned unchanged): "18:00" + AM, "00:30" + PM, invalid text.
 */
export function applyPeriodToText(
  text: string,
  period: PeriodSelection,
): string {
  const trimmed = text.trim();
  if (trimmed === "") return text;

  if (period === "") {
    const parsed = parseClockTime(trimmed);
    if (!parsed.ok) return text;
    const h24 = to24Hour(parsed.value);
    const hh = String(h24.hours).padStart(2, "0");
    const mm = String(h24.minutes).padStart(2, "0");
    const ss = h24.seconds ?? 0;
    return ss > 0 ? `${hh}:${mm}:${String(ss).padStart(2, "0")}` : `${hh}:${mm}`;
  }

  const withoutPeriod = trimmed.replace(/\s*(AM|PM)$/i, "");
  const match = withoutPeriod.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?$/);
  if (!match) return text;

  const hour = parseInt(match[1], 10);
  const minutes = match[2] ?? "00";
  const seconds = match[3];
  const suffix = seconds ? `:${seconds}` : "";

  if (hour >= 1 && hour <= 12) {
    return `${hour}:${minutes}${suffix} ${period}`;
  }
  if (hour === 0 && period === "AM") {
    return `12:${minutes}${suffix} AM`;
  }
  if (hour >= 13 && hour <= 23 && period === "PM") {
    return `${hour - 12}:${minutes}${suffix} PM`;
  }
  return text;
}

function derivePeriod(value: string): PeriodSelection {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const parsed = parseClockTime(trimmed);
  if (!parsed.ok) return "";
  return parsed.value.period ?? "";
}

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
  required?: boolean;
  /**
   * Period shown by the selector while the field is empty (UI selection
   * only — never written into the time string). Omit for the legacy
   * behavior: selector shows "—" and is disabled when empty.
   */
  defaultPeriod?: "AM" | "PM";
}

export function TimeInput({
  label,
  value,
  onChange,
  placeholder = "HH:MM",
  error,
  id: externalId,
  required,
  defaultPeriod,
}: TimeInputProps) {
  const autoId = useId();
  const inputId = externalId ?? autoId;
  const errorId = `${inputId}-error`;

  // UI-only selection for an empty field; never becomes part of the time
  // value. The parent-owned string remains the single time source of truth.
  const [pendingPeriod, setPendingPeriod] = useState<PeriodSelection>(
    defaultPeriod ?? "",
  );

  // When the parent clears the field (calculator reset, user delete),
  // return the selector to the configured default. Adjusted during render
  // (React's documented derived-state-from-props pattern) so an explicit
  // selection made while the field is empty is preserved until then.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value.trim() === "") {
      setPendingPeriod(defaultPeriod ?? "");
    }
  }

  const isEmpty = value.trim() === "";
  const selectValue = isEmpty ? pendingPeriod : derivePeriod(value);
  const disabled = isEmpty && defaultPeriod === undefined;

  const handleSelectChange = (next: PeriodSelection) => {
    setPendingPeriod(next);
    if (isEmpty) {
      // Empty field: update the visible selection only. Never write a
      // period (or a fabricated time) into an empty time string.
      return;
    }
    onChange(applyPeriodToText(value, next));
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-zinc-700"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={inputId}
          type="text"
          inputMode="text"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          className={`min-w-[8ch] flex-1 rounded-md border bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-zinc-300"
          }`}
        />
        <select
          value={selectValue}
          disabled={disabled}
          onChange={(e) =>
            handleSelectChange(e.target.value as PeriodSelection)
          }
          aria-label={`${label} AM/PM`}
          aria-describedby={error ? errorId : undefined}
          className={`w-[4.5rem] shrink-0 rounded-md border bg-white px-2 py-2.5 text-base text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400 ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-zinc-300"
          }`}
        >
          <option value="">—</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
