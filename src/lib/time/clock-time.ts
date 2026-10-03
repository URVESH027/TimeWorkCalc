import type { ClockTime, EngineResult, EngineError } from "@/types/time";

/**
 * Minutes in a full day.
 */
const MINUTES_PER_DAY = 24 * 60;

/**
 * Create a ClockTime object with validation.
 */
export function createClockTime(
  hours: number,
  minutes: number,
  period: "AM" | "PM" | null = null,
  seconds = 0,
): EngineResult<ClockTime> {
  const errors: EngineError[] = [];

  if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
    errors.push({
      code: "INVALID_HOURS",
      message: `Hours must be an integer between 0 and 23, got ${hours}`,
    });
  }

  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    errors.push({
      code: "INVALID_MINUTES",
      message: `Minutes must be an integer between 0 and 59, got ${minutes}`,
    });
  }

  if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
    errors.push({
      code: "INVALID_SECONDS",
      message: `Seconds must be an integer between 0 and 59, got ${seconds}`,
    });
  }

  if (period !== null && period !== "AM" && period !== "PM") {
    errors.push({
      code: "INVALID_PERIOD",
      message: `Period must be "AM", "PM", or null, got ${String(period)}`,
    });
  }

  if (errors.length > 0) {
    return { ok: false, error: errors[0] };
  }

  return {
    ok: true,
    value: { hours, minutes, seconds, period },
  };
}

/**
 * Convert a ClockTime to minutes since midnight (0-1439).
 *
 * For 12-hour times, AM 12:00 = 0 (midnight), PM 12:00 = 720 (noon).
 * For 24-hour times, directly compute hours * 60 + minutes.
 */
export function toMinutesSinceMidnight(time: ClockTime): number {
  let h = time.hours;

  if (time.period !== null) {
    if (time.period === "AM") {
      h = h === 12 ? 0 : h;
    } else {
      h = h === 12 ? 12 : h + 12;
    }
  }

  return h * 60 + time.minutes;
}

/**
 * Convert a ClockTime to seconds since midnight (0-86399).
 *
 * Seconds-preserving counterpart of toMinutesSinceMidnight. Used for
 * elapsed-time arithmetic so that non-zero input seconds are never
 * silently discarded.
 *
 * For 12-hour times, AM 12:00:00 = 0, PM 12:00:00 = 43200.
 */
export function toSecondsSinceMidnight(time: ClockTime): number {
  let h = time.hours;

  if (time.period !== null) {
    if (time.period === "AM") {
      h = h === 12 ? 0 : h;
    } else {
      h = h === 12 ? 12 : h + 12;
    }
  }

  return h * 3600 + time.minutes * 60 + (time.seconds ?? 0);
}

/**
 * Convert minutes since midnight (0-1439) to a 24-hour ClockTime.
 */
export function fromMinutesSinceMidnight(totalMinutes: number): ClockTime {
  const normalized = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return { hours, minutes, seconds: 0, period: null };
}

/**
 * Parse a time string into a ClockTime.
 *
 * Supported formats:
 * - "09:30" (24-hour)
 * - "9:30" (24-hour, no leading zero)
 * - "17:30" (24-hour)
 * - "09:30 AM" / "9:30 pm" (12-hour with minutes)
 * - "9:30" (24-hour, hour-only with minutes is never ambiguous)
 * - "6 am" / "6 pm" / "10 AM" (12-hour, hour only)
 * - "12:00 AM" (midnight), "12 am" (midnight)
 * - "12:00 PM" (noon), "12 pm" (noon)
 *
 * Hour-only input WITHOUT AM/PM (e.g. "6") is intentionally rejected as
 * ambiguous because the product has no defined 12/24-hour mode.
 */
export function parseClockTime(input: string): EngineResult<ClockTime> {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return {
      ok: false,
      error: { code: "EMPTY_INPUT", message: "Time string is empty" },
    };
  }

  // Colon form: "HH:MM", "H:MM", "HH:MM:SS", optionally followed by AM/PM.
  const colonMatch = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?$/i,
  );
  if (colonMatch) {
    const hours = parseInt(colonMatch[1], 10);
    const minutes = parseInt(colonMatch[2], 10);
    const seconds = colonMatch[3] ? parseInt(colonMatch[3], 10) : 0;

    if (colonMatch[4]) {
      const period = colonMatch[4].toUpperCase() as "AM" | "PM";

      // 12-hour format: hours must be 1-12
      if (hours < 1 || hours > 12) {
        return {
          ok: false,
          error: {
            code: "INVALID_HOURS",
            message: `12-hour format requires hours 1-12, got ${hours}`,
          },
        };
      }

      return createClockTime(hours, minutes, period, seconds);
    }

    return createClockTime(hours, minutes, null, seconds);
  }

  // Hour-only 12-hour format: "6 am", "10 PM", "6  pm"
  const hourOnlyMatch = trimmed.match(/^(\d{1,2})\s*(AM|PM)$/i);
  if (hourOnlyMatch) {
    const hours = parseInt(hourOnlyMatch[1], 10);
    const period = hourOnlyMatch[2].toUpperCase() as "AM" | "PM";

    if (hours < 1 || hours > 12) {
      return {
        ok: false,
        error: {
          code: "INVALID_HOURS",
          message: `12-hour format requires hours 1-12, got ${hours}`,
        },
      };
    }

    return createClockTime(hours, 0, period, 0);
  }

  // Hour-only without AM/PM is ambiguous (no defined 12/24-hour mode).
  if (/^\d{1,2}$/.test(trimmed)) {
    return {
      ok: false,
      error: {
        code: "INVALID_FORMAT",
        message: `Ambiguous time "${trimmed}". Add AM or PM (e.g. "6 pm") or use 24-hour format with minutes (e.g. "06:00" or "18:00").`,
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "INVALID_FORMAT",
      message: `Cannot parse time string: "${trimmed}". Expected format: "HH:MM", "HH:MM AM/PM", or "H AM/PM"`,
    },
  };
}

/**
 * Validate that a ClockTime is structurally valid.
 */
export function isValidClockTime(time: ClockTime): boolean {
  return (
    Number.isInteger(time.hours) &&
    time.hours >= 0 &&
    time.hours <= 23 &&
    Number.isInteger(time.minutes) &&
    time.minutes >= 0 &&
    time.minutes <= 59 &&
    Number.isInteger(time.seconds ?? 0) &&
    (time.seconds ?? 0) >= 0 &&
    (time.seconds ?? 0) <= 59 &&
    (time.period === null || time.period === "AM" || time.period === "PM")
  );
}

/**
 * Normalize a 12-hour ClockTime to 24-hour representation.
 */
export function to24Hour(time: ClockTime): ClockTime {
  if (time.period === null) {
    return { ...time };
  }

  let h = time.hours;
  if (time.period === "AM") {
    h = h === 12 ? 0 : h;
  } else {
    h = h === 12 ? 12 : h + 12;
  }

  return { hours: h, minutes: time.minutes, seconds: time.seconds, period: null };
}

/**
 * Normalize a 24-hour ClockTime to 12-hour representation.
 */
export function to12Hour(time: ClockTime): ClockTime {
  if (time.period !== null) {
    return { ...time };
  }

  let h = time.hours;
  let period: "AM" | "PM" = "AM";

  if (h === 0) {
    h = 12;
    period = "AM";
  } else if (h < 12) {
    period = "AM";
  } else if (h === 12) {
    period = "PM";
  } else {
    h = h - 12;
    period = "PM";
  }

  return { hours: h, minutes: time.minutes, seconds: time.seconds, period };
}
