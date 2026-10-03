import { describe, it, expect } from "vitest";
import {
  parseClockTime,
  calculateWorkHours,
  timeDifference,
  addDurations,
  subtractDuration,
  multiplyDuration,
  durationToDecimalHours,
  decimalHoursToDuration,
  formatDurationFull,
  formatDurationShort,
} from "@/lib/time";

describe("Calculator workflows", () => {
  describe("Workflow A: 9:00 AM to 5:30 PM", () => {
    it("calculates elapsed time correctly", () => {
      const start = parseClockTime("9:00 AM");
      const end = parseClockTime("5:30 PM");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = timeDifference(start.value, end.value);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.duration).toEqual({ hours: 8, minutes: 30, seconds: 0 });
          expect(result.value.decimalHours).toBe(8.5);
        }
      }
    });
  });

  describe("Workflow B: 9:00 AM to 5:30 PM + 30-min break", () => {
    it("calculates worked time correctly", () => {
      const start = parseClockTime("9:00 AM");
      const end = parseClockTime("5:30 PM");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = calculateWorkHours(start.value, end.value, [30]);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.worked).toEqual({ hours: 8, minutes: 0, seconds: 0 });
          expect(result.value.decimalHours).toBe(8);
        }
      }
    });
  });

  describe("Workflow C: 10:00 PM to 6:00 AM (overnight)", () => {
    it("calculates overnight shift correctly", () => {
      const start = parseClockTime("10:00 PM");
      const end = parseClockTime("6:00 AM");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = timeDifference(start.value, end.value, true);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.duration).toEqual({ hours: 8, minutes: 0, seconds: 0 });
        }
      }
    });

    it("calculates overnight shift with break", () => {
      const start = parseClockTime("10:00 PM");
      const end = parseClockTime("6:00 AM");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = calculateWorkHours(start.value, end.value, [30]);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.worked).toEqual({ hours: 7, minutes: 30, seconds: 0 });
        }
      }
    });
  });

  describe("Workflow D: Multiple work periods", () => {
    it("calculates two periods correctly", () => {
      const morning = calculateWorkHours(
        { hours: 9, minutes: 0, seconds: 0, period: null },
        { hours: 12, minutes: 0, seconds: 0, period: null },
        [],
      );
      const afternoon = calculateWorkHours(
        { hours: 13, minutes: 0, seconds: 0, period: null },
        { hours: 17, minutes: 30, seconds: 0, period: null },
        [],
      );
      expect(morning.ok).toBe(true);
      expect(afternoon.ok).toBe(true);
      if (morning.ok && afternoon.ok) {
        const total = addDurations(morning.value.worked, afternoon.value.worked);
        expect(total).toEqual({ hours: 7, minutes: 30, seconds: 0 });
      }
    });
  });

  describe("Workflow E: Full work week", () => {
    it("calculates 5-day week correctly", () => {
      const dayResult = calculateWorkHours(
        { hours: 9, minutes: 0, seconds: 0, period: null },
        { hours: 17, minutes: 0, seconds: 0, period: null },
        [60],
      );
      expect(dayResult.ok).toBe(true);
      if (dayResult.ok) {
        const weekTotal = multiplyDuration(dayResult.value.worked, 5);
        expect(weekTotal).toEqual({ hours: 35, minutes: 0, seconds: 0 });
        const decimalHours = durationToDecimalHours(weekTotal);
        expect(decimalHours).toBe(35);
      }
    });
  });

  describe("Workflow G: Natural hour-only input", () => {
    it("10 am → 6 pm = 8 hours", () => {
      const start = parseClockTime("10 am");
      const end = parseClockTime("6 pm");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = timeDifference(start.value, end.value);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.duration).toEqual({ hours: 8, minutes: 0, seconds: 0 });
          expect(result.value.decimalHours).toBe(8);
        }
      }
    });

    it("10 pm → 6 am = 8 hours overnight", () => {
      const start = parseClockTime("10 pm");
      const end = parseClockTime("6 am");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = timeDifference(start.value, end.value, true);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.duration).toEqual({ hours: 8, minutes: 0, seconds: 0 });
        }
      }
    });

    it("12 am → 12 pm = 12 hours", () => {
      const start = parseClockTime("12 am");
      const end = parseClockTime("12 pm");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = timeDifference(start.value, end.value);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.duration).toEqual({ hours: 12, minutes: 0, seconds: 0 });
        }
      }
    });

    it("12 pm → 12 am = 12 hours overnight", () => {
      const start = parseClockTime("12 pm");
      const end = parseClockTime("12 am");
      expect(start.ok).toBe(true);
      expect(end.ok).toBe(true);
      if (start.ok && end.ok) {
        const result = timeDifference(start.value, end.value, true);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.duration).toEqual({ hours: 12, minutes: 0, seconds: 0 });
        }
      }
    });
  });

  describe("Workflow F: Decimal hour conversion", () => {
    it("converts 7h 30m to 7.5", () => {
      const d = { hours: 7, minutes: 30, seconds: 0 };
      expect(durationToDecimalHours(d)).toBe(7.5);
    });

    it("converts 7.5 back to 7h 30m", () => {
      const d = decimalHoursToDuration(7.5);
      expect(d).toEqual({ hours: 7, minutes: 30, seconds: 0 });
    });

    it("converts 1h 15m to 1.25", () => {
      const d = { hours: 1, minutes: 15, seconds: 0 };
      expect(durationToDecimalHours(d)).toBe(1.25);
    });

    it("converts 0h 45m to 0.75", () => {
      const d = { hours: 0, minutes: 45, seconds: 0 };
      expect(durationToDecimalHours(d)).toBe(0.75);
    });
  });
});

describe("Formatting", () => {
  it("formatDurationFull works correctly", () => {
    expect(formatDurationFull({ hours: 8, minutes: 30, seconds: 0 })).toBe("8 hours 30 minutes");
    expect(formatDurationFull({ hours: 1, minutes: 0, seconds: 0 })).toBe("1 hour");
    expect(formatDurationFull({ hours: 0, minutes: 0, seconds: 0 })).toBe("0 hours");
  });

  it("formatDurationShort works correctly", () => {
    expect(formatDurationShort({ hours: 8, minutes: 30, seconds: 0 })).toBe("8h 30m");
    expect(formatDurationShort({ hours: 1, minutes: 0, seconds: 0 })).toBe("1h");
  });
});

describe("Time arithmetic", () => {
  it("adds durations", () => {
    expect(
      addDurations(
        { hours: 1, minutes: 30, seconds: 0 },
        { hours: 2, minutes: 45, seconds: 0 },
      ),
    ).toEqual({ hours: 4, minutes: 15, seconds: 0 });
  });

  it("subtracts durations", () => {
    expect(
      subtractDuration(
        { hours: 5, minutes: 0, seconds: 0 },
        { hours: 2, minutes: 30, seconds: 0 },
      ),
    ).toEqual({ hours: 2, minutes: 30, seconds: 0 });
  });

  it("multiplies duration", () => {
    expect(
      multiplyDuration({ hours: 2, minutes: 15, seconds: 0 }, 2),
    ).toEqual({ hours: 4, minutes: 30, seconds: 0 });
  });
});

describe("Edge cases", () => {
  it("same start and end returns zero", () => {
    const result = timeDifference(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 9, minutes: 0, seconds: 0, period: null },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalMinutes).toBe(0);
    }
  });

  it("end before start returns error in same-day mode", () => {
    const result = timeDifference(
      { hours: 17, minutes: 0, seconds: 0, period: null },
      { hours: 9, minutes: 0, seconds: 0, period: null },
    );
    expect(result.ok).toBe(false);
  });

  it("break equal to elapsed is valid", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 10, minutes: 0, seconds: 0, period: null },
      [60],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.worked).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    }
  });

  it("break exceeding elapsed returns error", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 10, minutes: 0, seconds: 0, period: null },
      [120],
    );
    expect(result.ok).toBe(false);
  });

  it("23:59 to 00:01 overnight = 2 minutes", () => {
    const result = timeDifference(
      { hours: 23, minutes: 59, seconds: 0, period: null },
      { hours: 0, minutes: 1, seconds: 0, period: null },
      true,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalMinutes).toBe(2);
    }
  });
});
