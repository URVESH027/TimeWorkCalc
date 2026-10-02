import type { Duration } from "@/types/time";
import { toTotalSeconds, fromTotalSeconds } from "./duration";

/**
 * Convert Duration to decimal hours.
 *
 * Examples:
 *   { hours: 7, minutes: 30, seconds: 0 } → 7.5
 *   { hours: 1, minutes: 15, seconds: 0 } → 1.25
 *   { hours: 0, minutes: 30, seconds: 0 } → 0.5
 *   { hours: 0, minutes: 45, seconds: 0 } → 0.75
 *
 * Uses Math.round to 4 decimal places to avoid floating-point artifacts.
 * 7.5 is exact; 1.25 is exact; 1/3 hour rounds to 0.3333.
 */
export function durationToDecimalHours(d: Duration): number {
  const totalSeconds = toTotalSeconds(d);
  const decimalHours = totalSeconds / 3600;
  return Math.round(decimalHours * 10000) / 10000;
}

/**
 * Convert decimal hours to Duration.
 *
 * Examples:
 *   7.5 → { hours: 7, minutes: 30, seconds: 0 }
 *   1.25 → { hours: 1, minutes: 15, seconds: 0 }
 *   0.5 → { hours: 0, minutes: 30, seconds: 0 }
 *   0.75 → { hours: 0, minutes: 45, seconds: 0 }
 *
 * Preserves sub-minute precision in the seconds field.
 */
export function decimalHoursToDuration(decimalHours: number): Duration {
  if (!Number.isFinite(decimalHours)) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.round(decimalHours * 3600);
  return fromTotalSeconds(totalSeconds);
}

/**
 * Convert Duration to total minutes (can be fractional).
 *
 * Examples:
 *   { hours: 1, minutes: 30, seconds: 0 } → 90
 *   { hours: 0, minutes: 45, seconds: 30 } → 45.5
 */
export function durationToTotalMinutes(d: Duration): number {
  const totalSeconds = toTotalSeconds(d);
  return totalSeconds / 60;
}

/**
 * Convert total minutes to Duration.
 *
 * Examples:
 *   90 → { hours: 1, minutes: 30, seconds: 0 }
 *   45.5 → { hours: 0, minutes: 45, seconds: 30 }
 */
export function totalMinutesToDuration(totalMinutes: number): Duration {
  if (!Number.isFinite(totalMinutes)) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.round(totalMinutes * 60);
  return fromTotalSeconds(totalSeconds);
}

/**
 * Convert Duration to total seconds.
 * Alias for toTotalSeconds for API consistency in the conversions module.
 */
export function durationToTotalSeconds(d: Duration): number {
  return toTotalSeconds(d);
}

/**
 * Convert total seconds to Duration.
 * Alias for fromTotalSeconds for API consistency in the conversions module.
 */
export function totalSecondsToDuration(totalSeconds: number): Duration {
  return fromTotalSeconds(totalSeconds);
}
