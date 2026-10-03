import { describe, it, expect } from "vitest";
import {
  calculateSimpleWorkHours,
  calculateWorkHoursWithBreaks,
  calculateMultiDayTotals,
} from "@/lib/time/work-hours";

describe("calculateSimpleWorkHours", () => {
  it("simple 8-hour shift with 30m break", () => {
    const result = calculateSimpleWorkHours({
      clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
      clockOut: { hours: 17, minutes: 30, seconds: 0, period: null },
      breakMinutes: 30,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.worked).toEqual({ hours: 8, minutes: 0, seconds: 0 });
      expect(result.value.decimalHours).toBe(8);
    }
  });

  it("shift with no break", () => {
    const result = calculateSimpleWorkHours({
      clockIn: { hours: 8, minutes: 0, seconds: 0, period: null },
      clockOut: { hours: 16, minutes: 0, seconds: 0, period: null },
      breakMinutes: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.worked).toEqual({ hours: 8, minutes: 0, seconds: 0 });
    }
  });
});

describe("calculateWorkHoursWithBreaks", () => {
  it("two breaks", () => {
    const result = calculateWorkHoursWithBreaks({
      clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
      clockOut: { hours: 18, minutes: 0, seconds: 0, period: null },
      breaks: [30, 30],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.elapsed).toEqual({ hours: 9, minutes: 0, seconds: 0 });
      expect(result.value.totalBreak).toEqual({ hours: 1, minutes: 0, seconds: 0 });
      expect(result.value.worked).toEqual({ hours: 8, minutes: 0, seconds: 0 });
    }
  });

  it("three breaks", () => {
    const result = calculateWorkHoursWithBreaks({
      clockIn: { hours: 7, minutes: 0, seconds: 0, period: null },
      clockOut: { hours: 19, minutes: 0, seconds: 0, period: null },
      breaks: [15, 45, 15],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalBreak).toEqual({ hours: 1, minutes: 15, seconds: 0 });
      expect(result.value.worked).toEqual({ hours: 10, minutes: 45, seconds: 0 });
    }
  });

  it("empty breaks array", () => {
    const result = calculateWorkHoursWithBreaks({
      clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
      clockOut: { hours: 17, minutes: 0, seconds: 0, period: null },
      breaks: [],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.worked).toEqual({ hours: 8, minutes: 0, seconds: 0 });
    }
  });
});

describe("calculateMultiDayTotals", () => {
  it("single entry", () => {
    const result = calculateMultiDayTotals([
      {
        clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
        clockOut: { hours: 17, minutes: 0, seconds: 0, period: null },
        breaks: [60],
      },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.days).toHaveLength(1);
      expect(result.value.totalWorked).toEqual({ hours: 7, minutes: 0, seconds: 0 });
      expect(result.value.totalDecimalHours).toBe(7);
    }
  });

  it("multiple entries with same durations", () => {
    const entry = {
      clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
      clockOut: { hours: 17, minutes: 0, seconds: 0, period: null },
      breaks: [60],
    };
    const result = calculateMultiDayTotals([entry, entry, entry, entry, entry]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.days).toHaveLength(5);
      expect(result.value.totalWorked).toEqual({ hours: 35, minutes: 0, seconds: 0 });
      expect(result.value.totalDecimalHours).toBe(35);
    }
  });

  it("multiple entries with different durations", () => {
    const result = calculateMultiDayTotals([
      {
        clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
        clockOut: { hours: 17, minutes: 0, seconds: 0, period: null },
        breaks: [60],
      },
      {
        clockIn: { hours: 8, minutes: 30, seconds: 0, period: null },
        clockOut: { hours: 16, minutes: 30, seconds: 0, period: null },
        breaks: [30],
      },
      {
        clockIn: { hours: 10, minutes: 0, seconds: 0, period: null },
        clockOut: { hours: 18, minutes: 0, seconds: 0, period: null },
        breaks: [60],
      },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.days).toHaveLength(3);
      expect(result.value.totalWorked).toEqual({ hours: 21, minutes: 30, seconds: 0 });
      expect(result.value.totalDecimalHours).toBe(21.5);
    }
  });

  it("empty array returns zeros", () => {
    const result = calculateMultiDayTotals([]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.days).toHaveLength(0);
      expect(result.value.totalWorked).toEqual({ hours: 0, minutes: 0, seconds: 0 });
      expect(result.value.totalDecimalHours).toBe(0);
    }
  });

  it("entry with zero duration (clockIn === clockOut)", () => {
    const result = calculateMultiDayTotals([
      {
        clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
        clockOut: { hours: 9, minutes: 0, seconds: 0, period: null },
        breaks: [],
      },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalWorked).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    }
  });

  it("mixed regular and zero-duration entries", () => {
    const result = calculateMultiDayTotals([
      {
        clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
        clockOut: { hours: 17, minutes: 0, seconds: 0, period: null },
        breaks: [60],
      },
      {
        clockIn: { hours: 9, minutes: 0, seconds: 0, period: null },
        clockOut: { hours: 9, minutes: 0, seconds: 0, period: null },
        breaks: [],
      },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalWorked).toEqual({ hours: 7, minutes: 0, seconds: 0 });
    }
  });

  it("totals preserve seconds across multiple days", () => {
    const result = calculateMultiDayTotals([
      {
        clockIn: { hours: 9, minutes: 0, seconds: 30, period: null },
        clockOut: { hours: 17, minutes: 0, seconds: 45, period: null },
        breaks: [],
      },
      {
        clockIn: { hours: 8, minutes: 30, seconds: 15, period: null },
        clockOut: { hours: 12, minutes: 30, seconds: 45, period: null },
        breaks: [],
      },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Day 1: 8h 0m 15s; Day 2: 4h 0m 30s
      expect(result.value.days[0].worked).toEqual({ hours: 8, minutes: 0, seconds: 15 });
      expect(result.value.days[1].worked).toEqual({ hours: 4, minutes: 0, seconds: 30 });
      expect(result.value.totalWorked).toEqual({ hours: 12, minutes: 0, seconds: 45 });
      expect(result.value.totalDecimalHours).toBe(12.0125);
    }
  });

  it("single day with seconds and a minute break", () => {
    const result = calculateMultiDayTotals([
      {
        clockIn: { hours: 9, minutes: 15, seconds: 45, period: null },
        clockOut: { hours: 17, minutes: 0, seconds: 15, period: null },
        breaks: [30],
      },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Elapsed 7h 44m 30s − 30m break = 7h 14m 30s
      expect(result.value.totalElapsed).toEqual({ hours: 7, minutes: 44, seconds: 30 });
      expect(result.value.totalWorked).toEqual({ hours: 7, minutes: 14, seconds: 30 });
    }
  });
});
