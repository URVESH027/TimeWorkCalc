/**
 * Clock time representation (e.g., 9:30 AM)
 *
 * Period is null for 24-hour representation.
 * Period is "AM" | "PM" for 12-hour representation.
 */
export interface ClockTime {
  hours: number;
  minutes: number;
  seconds?: number;
  period: "AM" | "PM" | null;
}

/**
 * Duration representation (e.g., 8 hours 30 minutes)
 *
 * Internal arithmetic uses total seconds to avoid floating-point issues.
 * The public Duration type uses hours/minutes/seconds for human readability.
 */
export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Work period with a single break duration (for simple work-hours calculators)
 */
export interface WorkPeriod {
  clockIn: ClockTime;
  clockOut: ClockTime;
  breakMinutes: number;
}

/**
 * Work period supporting multiple breaks
 */
export interface WorkPeriodWithBreaks {
  clockIn: ClockTime;
  clockOut: ClockTime;
  breaks: number[];
}

/**
 * Single day entry for multi-day / time-card calculations
 */
export interface DayEntry {
  clockIn: ClockTime;
  clockOut: ClockTime;
  breaks: number[];
}

/**
 * Structured error for engine operations
 */
export interface EngineError {
  code: string;
  message: string;
}

/**
 * Result type for all engine operations.
 * Ok results contain the value; error results contain a structured error.
 */
export type EngineResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: EngineError };

/**
 * Result of a work-hours calculation
 */
export interface WorkHoursResult {
  elapsed: Duration;
  totalBreak: Duration;
  worked: Duration;
  decimalHours: number;
}

/**
 * Result of a time difference calculation
 */
export interface TimeDifferenceResult {
  duration: Duration;
  totalMinutes: number;
  decimalHours: number;
}

/**
 * Multi-day totals result
 */
export interface MultiDayResult {
  days: WorkHoursResult[];
  totalElapsed: Duration;
  totalBreak: Duration;
  totalWorked: Duration;
  totalDecimalHours: number;
}
