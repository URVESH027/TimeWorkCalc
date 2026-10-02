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
 * - "09:30 AM" (12-hour)
 * - "9:30 PM" (12-hour)
 * - "17:30" (24-hour)
 * - "12:00 AM" (midnight)
 * - "12:00 PM" (noon)
 */
export function parseClockTime(input: string): EngineResult<ClockTime> {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return {
      ok: false,
      error: { code: "EMPTY_INPUT", message: "Time string is empty" },
    };
  }

  // Try 12-hour format: "HH:MM AM/PM" or "H:MM AM/PM"
  const twelveHourMatch = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i,
  );
  if (twelveHourMatch) {
    const hours = parseInt(twelveHourMatch[1], 10);
    const minutes = parseInt(twelveHourMatch[2], 10);
    const seconds = twelveHourMatch[3]
      ? parseInt(twelveHourMatch[3], 10)
      : 0;
    const period = twelveHourMatch[4].toUpperCase() as "AM" | "PM";

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

  // Try 24-hour format: "HH:MM" or "H:MM" or "HH:MM:SS"
  const twentyFourHourMatch = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (twentyFourHourMatch) {
    const hours = parseInt(twentyFourHourMatch[1], 10);
    const minutes = parseInt(twentyFourHourMatch[2], 10);
    const seconds = twentyFourHourMatch[3]
      ? parseInt(twentyFourHourMatch[3], 10)
      : 0;

    return createClockTime(hours, minutes, null, seconds);
  }

  return {
    ok: false,
    error: {
      code: "INVALID_FORMAT",
      message: `Cannot parse time string: "${trimmed}". Expected format: "HH:MM" or "HH:MM AM/PM"`,
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
