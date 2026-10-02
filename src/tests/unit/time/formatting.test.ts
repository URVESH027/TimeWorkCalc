import { describe, it, expect } from "vitest";
import {
  formatDurationFull,
  formatDurationShort,
  formatDurationAsMinutes,
  formatDurationAsDecimalHours,
  formatClockTime,
} from "@/lib/time/formatting";

describe("formatDurationFull", () => {
  it("formats hours and minutes", () => {
    expect(formatDurationFull({ hours: 8, minutes: 30, seconds: 0 })).toBe(
      "8 hours 30 minutes",
    );
  });

  it("formats hours only", () => {
    expect(formatDurationFull({ hours: 1, minutes: 0, seconds: 0 })).toBe("1 hour");
  });

  it("formats minutes only", () => {
    expect(formatDurationFull({ hours: 0, minutes: 45, seconds: 0 })).toBe(
      "45 minutes",
    );
  });

  it("formats seconds only", () => {
    expect(formatDurationFull({ hours: 0, minutes: 0, seconds: 30 })).toBe(
      "30 seconds",
    );
  });

  it("formats zero as '0 hours'", () => {
    expect(formatDurationFull({ hours: 0, minutes: 0, seconds: 0 })).toBe("0 hours");
  });

  it("formats plural correctly", () => {
    expect(formatDurationFull({ hours: 2, minutes: 1, seconds: 1 })).toBe(
      "2 hours 1 minute 1 second",
    );
  });
});

describe("formatDurationShort", () => {
  it("formats as '8h 30m'", () => {
    expect(formatDurationShort({ hours: 8, minutes: 30, seconds: 0 })).toBe("8h 30m");
  });

  it("formats as '1h'", () => {
    expect(formatDurationShort({ hours: 1, minutes: 0, seconds: 0 })).toBe("1h");
  });

  it("formats as '45m'", () => {
    expect(formatDurationShort({ hours: 0, minutes: 45, seconds: 0 })).toBe("45m");
  });

  it("formats as '30s'", () => {
    expect(formatDurationShort({ hours: 0, minutes: 0, seconds: 30 })).toBe("30s");
  });

  it("formats zero as '0h'", () => {
    expect(formatDurationShort({ hours: 0, minutes: 0, seconds: 0 })).toBe("0h");
  });
});

describe("formatDurationAsMinutes", () => {
  it("formats 1h 30m as '90 minutes'", () => {
    expect(formatDurationAsMinutes({ hours: 1, minutes: 30, seconds: 0 })).toBe(
      "90 minutes",
    );
  });

  it("formats 45m as '45 minutes'", () => {
    expect(formatDurationAsMinutes({ hours: 0, minutes: 45, seconds: 0 })).toBe(
      "45 minutes",
    );
  });

  it("formats 1 minute as '1 minute'", () => {
    expect(formatDurationAsMinutes({ hours: 0, minutes: 1, seconds: 0 })).toBe(
      "1 minute",
    );
  });
});

describe("formatDurationAsDecimalHours", () => {
  it("formats 7h 30m as '7.5 hours'", () => {
    expect(
      formatDurationAsDecimalHours({ hours: 7, minutes: 30, seconds: 0 }),
    ).toBe("7.5 hours");
  });

  it("formats 1h 15m as '1.25 hours'", () => {
    expect(
      formatDurationAsDecimalHours({ hours: 1, minutes: 15, seconds: 0 }),
    ).toBe("1.25 hours");
  });

  it("formats 8h as '8 hours'", () => {
    expect(formatDurationAsDecimalHours({ hours: 8, minutes: 0, seconds: 0 })).toBe(
      "8 hours",
    );
  });
});

describe("formatClockTime", () => {
  it("formats 24-hour time", () => {
    expect(formatClockTime(9, 30, null, true)).toBe("09:30");
  });

  it("formats 24-hour time without leading zero", () => {
    expect(formatClockTime(9, 30, null)).toBe("09:30");
  });

  it("formats 12-hour AM time", () => {
    expect(formatClockTime(9, 30, "AM", false)).toBe("9:30 AM");
  });

  it("formats 12-hour PM time", () => {
    expect(formatClockTime(17, 30, "PM", false)).toBe("5:30 PM");
  });

  it("formats 12:00 AM as 12:00 AM", () => {
    expect(formatClockTime(12, 0, "AM", false)).toBe("12:00 AM");
  });

  it("formats 12:00 PM as 12:00 PM", () => {
    expect(formatClockTime(12, 0, "PM", false)).toBe("12:00 PM");
  });
});
