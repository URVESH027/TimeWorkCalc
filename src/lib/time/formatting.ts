import type { Duration } from "@/types/time";

/**
 * Format a duration as a full human-readable string.
 *
 * Examples:
 *   { hours: 8, minutes: 30, seconds: 0 } → "8 hours 30 minutes"
 *   { hours: 1, minutes: 0, seconds: 0 } → "1 hour"
 *   { hours: 0, minutes: 0, seconds: 45 } → "45 seconds"
 *   { hours: 0, minutes: 0, seconds: 0 } → "0 hours"
 */
export function formatDurationFull(d: Duration): string {
  const parts: string[] = [];

  if (d.hours !== 0) {
    parts.push(`${d.hours} hour${d.hours === 1 ? "" : "s"}`);
  }

  if (d.minutes !== 0) {
    parts.push(`${d.minutes} minute${d.minutes === 1 ? "" : "s"}`);
  }

  if (d.seconds !== 0) {
    parts.push(`${d.seconds} second${d.seconds === 1 ? "" : "s"}`);
  }

  return parts.length > 0 ? parts.join(" ") : "0 hours";
}

/**
 * Format a duration as a short string.
 *
 * Examples:
 *   { hours: 8, minutes: 30, seconds: 0 } → "8h 30m"
 *   { hours: 1, minutes: 0, seconds: 0 } → "1h"
 *   { hours: 0, minutes: 0, seconds: 45 } → "45s"
 *   { hours: 0, minutes: 0, seconds: 0 } → "0h"
 */
export function formatDurationShort(d: Duration): string {
  const parts: string[] = [];

  if (d.hours !== 0) {
    parts.push(`${d.hours}h`);
  }

  if (d.minutes !== 0) {
    parts.push(`${d.minutes}m`);
  }

  if (d.seconds !== 0) {
    parts.push(`${d.seconds}s`);
  }

  return parts.length > 0 ? parts.join(" ") : "0h";
}

/**
 * Format a duration as total minutes (with unit).
 *
 * Examples:
 *   { hours: 1, minutes: 30, seconds: 0 } → "90 minutes"
 *   { hours: 0, minutes: 45, seconds: 0 } → "45 minutes"
 */
export function formatDurationAsMinutes(d: Duration): string {
  const totalMinutes = d.hours * 60 + d.minutes;
  if (d.seconds > 0) {
    const decimal = d.seconds / 60;
    const rounded = Math.round((totalMinutes + decimal) * 100) / 100;
    return `${rounded} minutes`;
  }
  return `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;
}

/**
 * Format a duration as decimal hours (with unit).
 *
 * Examples:
 *   { hours: 7, minutes: 30, seconds: 0 } → "7.5 hours"
 *   { hours: 1, minutes: 15, seconds: 0 } → "1.25 hours"
 */
export function formatDurationAsDecimalHours(
  d: Duration,
  decimalPlaces = 2,
): string {
  const totalSeconds = d.hours * 3600 + d.minutes * 60 + d.seconds;
  const decimalHours = totalSeconds / 3600;
  const rounded =
    Math.round(decimalHours * Math.pow(10, decimalPlaces)) /
    Math.pow(10, decimalPlaces);
  return `${rounded} hours`;
}

/**
 * Format a clock time as a string.
 *
 * 24-hour: "09:30", "17:30"
 * 12-hour: "9:30 AM", "5:30 PM"
 */
export function formatClockTime(
  hours: number,
  minutes: number,
  period: "AM" | "PM" | null = null,
  use24Hour = true,
): string {
  if (use24Hour || period === null) {
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    return `${h}:${m}`;
  }

  const h = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const m = String(minutes).padStart(2, "0");
  return `${h}:${m} ${period}`;
}
