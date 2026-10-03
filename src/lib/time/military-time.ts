import type { ClockTime, EngineResult } from "@/types/time";
import { parseClockTime, createClockTime, to24Hour, to12Hour } from "./clock-time";
import { formatClockTime } from "./formatting";

/**
 * Compact military time: exactly four digits, "HHMM" (0000-2359).
 */
const COMPACT_MILITARY_RE = /^\d{4}$/;

/**
 * Parse a time string into a ClockTime, accepting compact military input in
 * addition to every format parseClockTime already supports.
 *
 * Compact input:
 * - "1430" (2:30 PM), "0900" (9:00 AM), "0000" (midnight), "2359" (11:59 PM)
 *
 * Everything else is delegated to the existing parser:
 * - "14:30" (24-hour colon form, optional seconds: "14:30:15")
 * - "2:30 PM" / "2:30 pm" (12-hour)
 *
 * Invalid input returns an EngineError result; nothing is thrown.
 */
export function parseMilitaryTime(input: string): EngineResult<ClockTime> {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return {
      ok: false,
      error: { code: "EMPTY_INPUT", message: "Time string is empty" },
    };
  }

  if (COMPACT_MILITARY_RE.test(trimmed)) {
    const hours = parseInt(trimmed.slice(0, 2), 10);
    const minutes = parseInt(trimmed.slice(2, 4), 10);
    const result = createClockTime(hours, minutes, null, 0);
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error.code,
          message: `Invalid military time "${trimmed}". ${result.error.message}`,
        },
      };
    }
    return result;
  }

  const parsed = parseClockTime(trimmed);
  if (!parsed.ok && parsed.error.code === "INVALID_FORMAT") {
    return {
      ok: false,
      error: {
        code: "INVALID_FORMAT",
        message: `Cannot read "${trimmed}". Enter a time like 1430, 14:30, or 2:30 PM.`,
      },
    };
  }
  return parsed;
}

export interface TimeRepresentations {
  /** Four-digit military time, e.g. "1430". Always exactly four digits. */
  military: string;
  /** 24-hour clock, e.g. "14:30". Includes ":SS" when seconds are present. */
  hour24: string;
  /** 12-hour clock, e.g. "2:30 PM". Includes ":SS" when seconds are present. */
  hour12: string;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Render a ClockTime in all three supported representations.
 *
 * Examples (via parseMilitaryTime then toTimeRepresentations):
 * - "1430"   → military "1430", 24-hour "14:30", 12-hour "2:30 PM"
 * - "0000"   → military "0000", 24-hour "00:00", 12-hour "12:00 AM"
 * - "1200"   → military "1200", 24-hour "12:00", 12-hour "12:00 PM"
 * - "9:00 AM" → military "0900" (leading zero preserved)
 */
export function toTimeRepresentations(clock: ClockTime): TimeRepresentations {
  const h24 = to24Hour(clock);
  const h12 = to12Hour(h24);
  const seconds = h24.seconds ?? 0;
  const secondSuffix = seconds > 0 ? `:${pad2(seconds)}` : "";

  const hour12Base = formatClockTime(h12.hours, h12.minutes, h12.period, false);
  const hour12 =
    seconds > 0 ? hour12Base.replace(" ", `:${pad2(seconds)} `) : hour12Base;

  return {
    military: `${pad2(h24.hours)}${pad2(h24.minutes)}`,
    hour24: `${pad2(h24.hours)}:${pad2(h24.minutes)}${secondSuffix}`,
    hour12,
  };
}
