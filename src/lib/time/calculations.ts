import type {
  ClockTime,
  TimeDifferenceResult,
  WorkHoursResult,
  EngineResult,
} from "@/types/time";
import { toMinutesSinceMidnight } from "./clock-time";
import {
  createDuration,
  toTotalSeconds,
  fromTotalSeconds,
} from "./duration";
import { durationToDecimalHours } from "./conversions";

/**
 * Calculate the time difference between two clock times.
 *
 * Same-day mode: assumes both times are on the same day.
 *   If end < start, returns an error (user should use overnight mode).
 *
 * Overnight mode: allows the end time to be on the next day.
 *   If end < start, assumes end is on the next day (adds 24 hours).
 *
 * 09:00 → 17:30 (same day) = 8h 30m
 * 22:00 → 06:00 (overnight) = 8h 00m
 * 09:00 → 09:00 (same day) = 0h 00m
 * 09:00 → 09:00 (overnight) = 0h 00m
 */
export function timeDifference(
  start: ClockTime,
  end: ClockTime,
  overnight = false,
): EngineResult<TimeDifferenceResult> {
  const startMinutes = toMinutesSinceMidnight(start);
  const endMinutes = toMinutesSinceMidnight(end);

  let diffMinutes: number;

  if (overnight) {
    if (endMinutes < startMinutes) {
      // End is on the next day
      diffMinutes = endMinutes + 24 * 60 - startMinutes;
    } else {
      // End is same day or equal (equal = 0 duration)
      diffMinutes = endMinutes - startMinutes;
    }
  } else {
    // Same-day mode: end must be >= start
    if (endMinutes < startMinutes) {
      return {
        ok: false,
        error: {
          code: "END_BEFORE_START",
          message:
            "End time is before start time. Use overnight mode if the end time is on the next day.",
        },
      };
    }
    diffMinutes = endMinutes - startMinutes;
  }

  const durationResult = createDuration(
    Math.floor(diffMinutes / 60),
    diffMinutes % 60,
    0,
  );

  if (!durationResult.ok) {
    return { ok: false, error: durationResult.error };
  }

  const duration = durationResult.value;
  const decimalHours = durationToDecimalHours(duration);

  return {
    ok: true,
    value: {
      duration,
      totalMinutes: diffMinutes,
      decimalHours,
    },
  };
}

/**
 * Calculate work hours for a single work period.
 *
 * Computes elapsed time, subtracts breaks, and returns worked duration.
 *
 * Example:
 *   clockIn: 09:00, clockOut: 17:30, breaks: [60]
 *   → elapsed: 8h 30m, break: 1h 0m, worked: 7h 30m
 */
export function calculateWorkHours(
  clockIn: ClockTime,
  clockOut: ClockTime,
  breaks: number[] = [],
): EngineResult<WorkHoursResult> {
  // Calculate elapsed time using overnight mode to handle late shifts
  const elapsedResult = timeDifference(clockIn, clockOut, true);
  if (!elapsedResult.ok) {
    return { ok: false, error: elapsedResult.error };
  }

  const elapsed = elapsedResult.value.duration;
  const elapsedSeconds = toTotalSeconds(elapsed);

  // Sum all breaks (in minutes)
  const totalBreakMinutes = breaks.reduce((sum, b) => sum + b, 0);
  const breakSeconds = totalBreakMinutes * 60;

  if (breakSeconds > elapsedSeconds) {
    return {
      ok: false,
      error: {
        code: "BREAKS_EXCEED_ELAPSED",
        message: `Total break duration (${totalBreakMinutes} minutes) exceeds elapsed time (${elapsedResult.value.totalMinutes} minutes)`,
      },
    };
  }

  const workedSeconds = elapsedSeconds - breakSeconds;
  const worked = fromTotalSeconds(workedSeconds);
  const totalBreak = fromTotalSeconds(breakSeconds);
  const decimalHours = durationToDecimalHours(worked);

  return {
    ok: true,
    value: {
      elapsed,
      totalBreak,
      worked,
      decimalHours,
    },
  };
}
