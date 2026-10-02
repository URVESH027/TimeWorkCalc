import type { Duration, EngineResult, EngineError } from "@/types/time";

/**
 * Create a Duration with validation.
 *
 * Negative component values are allowed for internal use (e.g., subtraction results),
 * but all three components must have the same sign or be zero.
 */
export function createDuration(
  hours: number,
  minutes: number,
  seconds = 0,
): EngineResult<Duration> {
  const errors: EngineError[] = [];

  if (!Number.isFinite(hours)) {
    errors.push({
      code: "INVALID_HOURS",
      message: `Hours must be a finite number, got ${hours}`,
    });
  }

  if (!Number.isFinite(minutes)) {
    errors.push({
      code: "INVALID_MINUTES",
      message: `Minutes must be a finite number, got ${minutes}`,
    });
  }

  if (!Number.isFinite(seconds)) {
    errors.push({
      code: "INVALID_SECONDS",
      message: `Seconds must be a finite number, got ${seconds}`,
    });
  }

  if (errors.length > 0) {
    return { ok: false, error: errors[0] };
  }

  return {
    ok: true,
    value: { hours, minutes, seconds },
  };
}

/**
 * Convert a Duration to total seconds.
 *
 * This is the canonical internal representation for arithmetic.
 * Using seconds avoids floating-point issues with decimal hours.
 */
export function toTotalSeconds(d: Duration): number {
  return d.hours * 3600 + d.minutes * 60 + d.seconds;
}

/**
 * Convert total seconds to a Duration.
 *
 * Preserves sign: negative seconds produce negative duration components.
 * Uses `|| 0` to avoid JavaScript's -0 values.
 */
export function fromTotalSeconds(totalSeconds: number): Duration {
  const sign = totalSeconds < 0 ? -1 : 1;
  const abs = Math.abs(totalSeconds);

  const hours = Math.floor(abs / 3600);
  const remainingMinutes = Math.floor((abs % 3600) / 60);
  const remainingSeconds = abs % 60;

  return {
    hours: sign * hours || 0,
    minutes: sign * remainingMinutes || 0,
    seconds: sign * remainingSeconds || 0,
  };
}

/**
 * Add two or more durations.
 *
 * Uses total seconds internally to avoid floating-point precision issues.
 */
export function addDurations(...durations: Duration[]): Duration {
  let totalSeconds = 0;
  for (const d of durations) {
    totalSeconds += toTotalSeconds(d);
  }
  return fromTotalSeconds(totalSeconds);
}

/**
 * Subtract one duration from another.
 *
 * Can produce negative results when the subtrahend is larger.
 * The caller decides how to handle negative results in the UI.
 */
export function subtractDuration(
  a: Duration,
  b: Duration,
): Duration {
  const secondsA = toTotalSeconds(a);
  const secondsB = toTotalSeconds(b);
  return fromTotalSeconds(secondsA - secondsB);
}

/**
 * Multiply a duration by a number.
 *
 * Supports fractional multipliers. Uses Math.round on the final seconds
 * to avoid floating-point artifacts (e.g., 0.1 + 0.2 = 0.30000000000000004).
 *
 * Examples:
 *   multiplyDuration({ hours: 2, minutes: 15, seconds: 0 }, 2)
 *   → { hours: 4, minutes: 30, seconds: 0 }
 *
 *   multiplyDuration({ hours: 1, minutes: 30, seconds: 0 }, 1.5)
 *   → { hours: 2, minutes: 15, seconds: 0 }
 */
export function multiplyDuration(d: Duration, factor: number): Duration {
  if (!Number.isFinite(factor)) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = toTotalSeconds(d);
  const resultSeconds = Math.round(totalSeconds * factor);
  return fromTotalSeconds(resultSeconds);
}

/**
 * Divide a duration by a number.
 *
 * Division by zero returns an error result.
 * Uses Math.round on the final seconds to avoid floating-point artifacts.
 *
 * Examples:
 *   divideDuration({ hours: 6, minutes: 0, seconds: 0 }, 2)
 *   → { hours: 3, minutes: 0, seconds: 0 }
 *
 *   divideDuration({ hours: 3, minutes: 0, seconds: 0 }, 2)
 *   → { hours: 1, minutes: 30, seconds: 0 }
 */
export function divideDuration(
  d: Duration,
  divisor: number,
): EngineResult<Duration> {
  if (divisor === 0) {
    return {
      ok: false,
      error: {
        code: "DIVISION_BY_ZERO",
        message: "Cannot divide duration by zero",
      },
    };
  }

  if (!Number.isFinite(divisor)) {
    return {
      ok: false,
      error: {
        code: "INVALID_DIVISOR",
        message: `Divisor must be a finite number, got ${divisor}`,
      },
    };
  }

  const totalSeconds = toTotalSeconds(d);
  const resultSeconds = Math.round(totalSeconds / divisor);
  return { ok: true, value: fromTotalSeconds(resultSeconds) };
}

/**
 * Check if a duration is zero (all components are zero).
 */
export function isZeroDuration(d: Duration): boolean {
  return d.hours === 0 && d.minutes === 0 && d.seconds === 0;
}

/**
 * Check if a duration is negative (any component is negative).
 */
export function isNegativeDuration(d: Duration): boolean {
  return d.hours < 0 || d.minutes < 0 || d.seconds < 0;
}

/**
 * Negate a duration (flip sign of all components).
 * Uses `|| 0` to avoid JavaScript's -0 values.
 */
export function negateDuration(d: Duration): Duration {
  return {
    hours: -d.hours || 0,
    minutes: -d.minutes || 0,
    seconds: -d.seconds || 0,
  };
}
