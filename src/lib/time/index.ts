// Clock time operations
export {
  createClockTime,
  toMinutesSinceMidnight,
  fromMinutesSinceMidnight,
  parseClockTime,
  isValidClockTime,
  to24Hour,
  to12Hour,
} from "./clock-time";

// Duration operations
export {
  createDuration,
  toTotalSeconds,
  fromTotalSeconds,
  addDurations,
  subtractDuration,
  multiplyDuration,
  divideDuration,
  isZeroDuration,
  isNegativeDuration,
  negateDuration,
} from "./duration";

// Conversions
export {
  durationToDecimalHours,
  decimalHoursToDuration,
  durationToTotalMinutes,
  totalMinutesToDuration,
  durationToTotalSeconds,
  totalSecondsToDuration,
} from "./conversions";

// Calculations
export { timeDifference, calculateWorkHours } from "./calculations";

// Work hours (multi-break, multi-day)
export {
  calculateSimpleWorkHours,
  calculateWorkHoursWithBreaks,
  calculateMultiDayTotals,
} from "./work-hours";

// Formatting
export {
  formatDurationFull,
  formatDurationShort,
  formatDurationAsMinutes,
  formatDurationAsDecimalHours,
  formatClockTime,
} from "./formatting";

// Validation
export {
  validateHour,
  validateMinute,
  validateSecond,
  validateDecimalHours,
  validateBreakMinutes,
  collectErrors,
} from "./validation";
