import { describe, it, expect } from "vitest";
import {
  durationToDecimalHours,
  decimalHoursToDuration,
  durationToTotalMinutes,
  totalMinutesToDuration,
  durationToTotalSeconds,
  totalSecondsToDuration,
} from "@/lib/time/conversions";

describe("durationToDecimalHours", () => {
  it("converts 7h 30m to 7.5", () => {
    expect(durationToDecimalHours({ hours: 7, minutes: 30, seconds: 0 })).toBe(7.5);
  });

  it("converts 1h 15m to 1.25", () => {
    expect(durationToDecimalHours({ hours: 1, minutes: 15, seconds: 0 })).toBe(1.25);
  });

  it("converts 0h 30m to 0.5", () => {
    expect(durationToDecimalHours({ hours: 0, minutes: 30, seconds: 0 })).toBe(0.5);
  });

  it("converts 0h 45m to 0.75", () => {
    expect(durationToDecimalHours({ hours: 0, minutes: 45, seconds: 0 })).toBe(0.75);
  });

  it("converts 2h 30m to 2.5", () => {
    expect(durationToDecimalHours({ hours: 2, minutes: 30, seconds: 0 })).toBe(2.5);
  });

  it("converts 0h to 0", () => {
    expect(durationToDecimalHours({ hours: 0, minutes: 0, seconds: 0 })).toBe(0);
  });

  it("converts 8h 0m to 8", () => {
    expect(durationToDecimalHours({ hours: 8, minutes: 0, seconds: 0 })).toBe(8);
  });

  it("handles seconds", () => {
    expect(durationToDecimalHours({ hours: 0, minutes: 0, seconds: 1800 })).toBe(0.5);
  });
});

describe("decimalHoursToDuration", () => {
  it("converts 7.5 to 7h 30m", () => {
    expect(decimalHoursToDuration(7.5)).toEqual({ hours: 7, minutes: 30, seconds: 0 });
  });

  it("converts 1.25 to 1h 15m", () => {
    expect(decimalHoursToDuration(1.25)).toEqual({ hours: 1, minutes: 15, seconds: 0 });
  });

  it("converts 0.5 to 0h 30m", () => {
    expect(decimalHoursToDuration(0.5)).toEqual({ hours: 0, minutes: 30, seconds: 0 });
  });

  it("converts 0.75 to 0h 45m", () => {
    expect(decimalHoursToDuration(0.75)).toEqual({ hours: 0, minutes: 45, seconds: 0 });
  });

  it("converts 2.5 to 2h 30m", () => {
    expect(decimalHoursToDuration(2.5)).toEqual({ hours: 2, minutes: 30, seconds: 0 });
  });

  it("converts 0 to 0h 0m", () => {
    expect(decimalHoursToDuration(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });

  it("converts 8 to 8h 0m", () => {
    expect(decimalHoursToDuration(8)).toEqual({ hours: 8, minutes: 0, seconds: 0 });
  });

  it("handles non-finite input", () => {
    expect(decimalHoursToDuration(NaN)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(decimalHoursToDuration(Infinity)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("bidirectional conversion", () => {
  it("converts 7h 30m → 7.5 → 7h 30m", () => {
    const original = { hours: 7, minutes: 30, seconds: 0 };
    const decimal = durationToDecimalHours(original);
    const back = decimalHoursToDuration(decimal);
    expect(back).toEqual(original);
  });

  it("converts 1h 15m → 1.25 → 1h 15m", () => {
    const original = { hours: 1, minutes: 15, seconds: 0 };
    const decimal = durationToDecimalHours(original);
    const back = decimalHoursToDuration(decimal);
    expect(back).toEqual(original);
  });

  it("converts 0h 45m → 0.75 → 0h 45m", () => {
    const original = { hours: 0, minutes: 45, seconds: 0 };
    const decimal = durationToDecimalHours(original);
    const back = decimalHoursToDuration(decimal);
    expect(back).toEqual(original);
  });
});

describe("durationToTotalMinutes", () => {
  it("converts 1h 30m to 90", () => {
    expect(durationToTotalMinutes({ hours: 1, minutes: 30, seconds: 0 })).toBe(90);
  });

  it("converts 0h 45m to 45", () => {
    expect(durationToTotalMinutes({ hours: 0, minutes: 45, seconds: 0 })).toBe(45);
  });

  it("converts with seconds", () => {
    expect(durationToTotalMinutes({ hours: 0, minutes: 45, seconds: 30 })).toBe(45.5);
  });
});

describe("totalMinutesToDuration", () => {
  it("converts 90 to 1h 30m", () => {
    expect(totalMinutesToDuration(90)).toEqual({ hours: 1, minutes: 30, seconds: 0 });
  });

  it("converts 45 to 0h 45m", () => {
    expect(totalMinutesToDuration(45)).toEqual({ hours: 0, minutes: 45, seconds: 0 });
  });

  it("converts 45.5 to 0h 45m 30s", () => {
    expect(totalMinutesToDuration(45.5)).toEqual({ hours: 0, minutes: 45, seconds: 30 });
  });

  it("handles non-finite input", () => {
    expect(totalMinutesToDuration(NaN)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("durationToTotalSeconds / totalSecondsToDuration", () => {
  it("round-trips through seconds", () => {
    const original = { hours: 2, minutes: 15, seconds: 30 };
    const seconds = durationToTotalSeconds(original);
    expect(seconds).toBe(8130);
    const back = totalSecondsToDuration(8130);
    expect(back).toEqual(original);
  });
});
