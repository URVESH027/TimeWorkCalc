import type {
  WorkPeriod,
  WorkPeriodWithBreaks,
  DayEntry,
  MultiDayResult,
  WorkHoursResult,
  EngineResult,
} from "@/types/time";
import { calculateWorkHours } from "./calculations";
import { toTotalSeconds, fromTotalSeconds } from "./duration";
import { durationToDecimalHours } from "./conversions";

/**
 * Calculate work hours for a simple work period (single break).
 */
export function calculateSimpleWorkHours(
  period: WorkPeriod,
): EngineResult<WorkHoursResult> {
  return calculateWorkHours(
    period.clockIn,
    period.clockOut,
    period.breakMinutes > 0 ? [period.breakMinutes] : [],
  );
}

/**
 * Calculate work hours for a period with multiple breaks.
 */
export function calculateWorkHoursWithBreaks(
  period: WorkPeriodWithBreaks,
): EngineResult<WorkHoursResult> {
  return calculateWorkHours(period.clockIn, period.clockOut, period.breaks);
}

/**
 * Calculate totals for multiple day entries (time card).
 *
 * Each day entry is processed independently, then totals are summed.
 * Zero-duration entries (clockIn === clockOut) contribute zero.
 */
export function calculateMultiDayTotals(
  entries: DayEntry[],
): EngineResult<MultiDayResult> {
  if (entries.length === 0) {
    return {
      ok: true,
      value: {
        days: [],
        totalElapsed: { hours: 0, minutes: 0, seconds: 0 },
        totalBreak: { hours: 0, minutes: 0, seconds: 0 },
        totalWorked: { hours: 0, minutes: 0, seconds: 0 },
        totalDecimalHours: 0,
      },
    };
  }

  const days: WorkHoursResult[] = [];
  let totalElapsedSeconds = 0;
  let totalBreakSeconds = 0;
  let totalWorkedSeconds = 0;

  for (const entry of entries) {
    const result = calculateWorkHours(entry.clockIn, entry.clockOut, entry.breaks);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    days.push(result.value);
    totalElapsedSeconds += toTotalSeconds(result.value.elapsed);
    totalBreakSeconds += toTotalSeconds(result.value.totalBreak);
    totalWorkedSeconds += toTotalSeconds(result.value.worked);
  }

  const totalElapsed = fromTotalSeconds(totalElapsedSeconds);
  const totalBreak = fromTotalSeconds(totalBreakSeconds);
  const totalWorked = fromTotalSeconds(totalWorkedSeconds);
  const totalDecimalHours = durationToDecimalHours(totalWorked);

  return {
    ok: true,
    value: {
      days,
      totalElapsed,
      totalBreak,
      totalWorked,
      totalDecimalHours,
    },
  };
}
