import { describe, it, expect } from "vitest";
import {
  createClockTime,
  toMinutesSinceMidnight,
  toSecondsSinceMidnight,
  fromMinutesSinceMidnight,
  parseClockTime,
  isValidClockTime,
  to24Hour,
  to12Hour,
} from "@/lib/time/clock-time";

describe("createClockTime", () => {
  it("creates a valid 24-hour clock time", () => {
    const result = createClockTime(9, 30);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        hours: 9,
        minutes: 30,
        seconds: 0,
        period: null,
      });
    }
  });

  it("creates a valid 12-hour clock time", () => {
    const result = createClockTime(9, 30, "AM");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        hours: 9,
        minutes: 30,
        seconds: 0,
        period: "AM",
      });
    }
  });

  it("creates a time with seconds", () => {
    const result = createClockTime(14, 45, null, 30);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.seconds).toBe(30);
    }
  });

  it("rejects invalid hours", () => {
    const result = createClockTime(24, 0);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_HOURS");
    }
  });

  it("rejects negative hours", () => {
    const result = createClockTime(-1, 0);
    expect(result.ok).toBe(false);
  });

  it("rejects invalid minutes", () => {
    const result = createClockTime(9, 60);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_MINUTES");
    }
  });

  it("rejects invalid seconds", () => {
    const result = createClockTime(9, 30, null, 60);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_SECONDS");
    }
  });

  it("rejects invalid period", () => {
    const result = createClockTime(9, 30, "NOON" as never);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_PERIOD");
    }
  });

  it("accepts 00:00 as midnight", () => {
    const result = createClockTime(0, 0);
    expect(result.ok).toBe(true);
  });

  it("accepts 23:59 as end of day", () => {
    const result = createClockTime(23, 59);
    expect(result.ok).toBe(true);
  });
});

describe("toMinutesSinceMidnight", () => {
  it("converts 00:00 to 0", () => {
    expect(toMinutesSinceMidnight({ hours: 0, minutes: 0, seconds: 0, period: null })).toBe(0);
  });

  it("converts 01:00 to 60", () => {
    expect(toMinutesSinceMidnight({ hours: 1, minutes: 0, seconds: 0, period: null })).toBe(60);
  });

  it("converts 12:00 (24h) to 720", () => {
    expect(toMinutesSinceMidnight({ hours: 12, minutes: 0, seconds: 0, period: null })).toBe(720);
  });

  it("converts 23:59 to 1439", () => {
    expect(toMinutesSinceMidnight({ hours: 23, minutes: 59, seconds: 0, period: null })).toBe(1439);
  });

  it("converts 12:00 AM to 0 (midnight)", () => {
    expect(toMinutesSinceMidnight({ hours: 12, minutes: 0, seconds: 0, period: "AM" })).toBe(0);
  });

  it("converts 12:00 PM to 720 (noon)", () => {
    expect(toMinutesSinceMidnight({ hours: 12, minutes: 0, seconds: 0, period: "PM" })).toBe(720);
  });

  it("converts 1:00 AM to 60", () => {
    expect(toMinutesSinceMidnight({ hours: 1, minutes: 0, seconds: 0, period: "AM" })).toBe(60);
  });

  it("converts 1:00 PM to 780", () => {
    expect(toMinutesSinceMidnight({ hours: 1, minutes: 0, seconds: 0, period: "PM" })).toBe(780);
  });

  it("converts 11:59 PM to 1439", () => {
    expect(toMinutesSinceMidnight({ hours: 11, minutes: 59, seconds: 0, period: "PM" })).toBe(1439);
  });
});

describe("fromMinutesSinceMidnight", () => {
  it("converts 0 to 00:00", () => {
    expect(fromMinutesSinceMidnight(0)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });

  it("converts 60 to 01:00", () => {
    expect(fromMinutesSinceMidnight(60)).toEqual({
      hours: 1,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });

  it("converts 720 to 12:00", () => {
    expect(fromMinutesSinceMidnight(720)).toEqual({
      hours: 12,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });

  it("converts 1439 to 23:59", () => {
    expect(fromMinutesSinceMidnight(1439)).toEqual({
      hours: 23,
      minutes: 59,
      seconds: 0,
      period: null,
    });
  });

  it("wraps around for values >= 1440", () => {
    expect(fromMinutesSinceMidnight(1440)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });

  it("handles negative values by wrapping", () => {
    expect(fromMinutesSinceMidnight(-60)).toEqual({
      hours: 23,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });
});

describe("parseClockTime", () => {
  it("parses 24-hour format HH:MM", () => {
    const result = parseClockTime("09:30");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        hours: 9,
        minutes: 30,
        seconds: 0,
        period: null,
      });
    }
  });

  it("parses 24-hour format without leading zero", () => {
    const result = parseClockTime("9:30");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hours).toBe(9);
      expect(result.value.minutes).toBe(30);
    }
  });

  it("parses 24-hour format with seconds", () => {
    const result = parseClockTime("14:45:30");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        hours: 14,
        minutes: 45,
        seconds: 30,
        period: null,
      });
    }
  });

  it("parses 12-hour format with AM", () => {
    const result = parseClockTime("9:30 AM");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        hours: 9,
        minutes: 30,
        seconds: 0,
        period: "AM",
      });
    }
  });

  it("parses 12-hour format with PM", () => {
    const result = parseClockTime("5:30 PM");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        hours: 5,
        minutes: 30,
        seconds: 0,
        period: "PM",
      });
    }
  });

  it("parses 12:00 AM as midnight", () => {
    const result = parseClockTime("12:00 AM");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hours).toBe(12);
      expect(result.value.period).toBe("AM");
    }
  });

  it("parses 12:00 PM as noon", () => {
    const result = parseClockTime("12:00 PM");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hours).toBe(12);
      expect(result.value.period).toBe("PM");
    }
  });

  it("parses 23:59 in 24-hour format", () => {
    const result = parseClockTime("23:59");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hours).toBe(23);
      expect(result.value.minutes).toBe(59);
    }
  });

  it("rejects empty string", () => {
    const result = parseClockTime("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("EMPTY_INPUT");
    }
  });

  it("rejects whitespace-only string", () => {
    const result = parseClockTime("   ");
    expect(result.ok).toBe(false);
  });

  it("rejects invalid format", () => {
    const result = parseClockTime("noon");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_FORMAT");
    }
  });

  it("rejects 13:00 AM in 12-hour format", () => {
    const result = parseClockTime("13:00 AM");
    expect(result.ok).toBe(false);
  });

  it("rejects 00:30 in 12-hour format", () => {
    const result = parseClockTime("0:30 AM");
    expect(result.ok).toBe(false);
  });

  it("trims whitespace from input", () => {
    const result = parseClockTime("  09:30  ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hours).toBe(9);
    }
  });
});

describe("parseClockTime: natural hour-only AM/PM", () => {
  const validHourOnly: Array<[string, number, "AM" | "PM"]> = [
    ["6 am", 6, "AM"],
    ["6 pm", 6, "PM"],
    ["10 am", 10, "AM"],
    ["10 pm", 10, "PM"],
    ["6:00 am", 6, "AM"],
    ["6:30 pm", 6, "PM"],
    ["12 am", 12, "AM"],
    ["12 pm", 12, "PM"],
    ["10:30 pm", 10, "PM"],
  ];

  for (const [input, hours, period] of validHourOnly) {
    it(`parses "${input}" → ${String(hours).padStart(2, "0")}:00 ${period}`, () => {
      const result = parseClockTime(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.hours).toBe(hours);
        expect(result.value.period).toBe(period);
        expect(result.value.minutes).toBe(input.includes(":") ? parseInt(input.split(":")[1], 10) : 0);
      }
    });
  }

  const twentyFourHour: Array<[string, number, number]> = [
    ["18:00", 18, 0],
    ["18:30", 18, 30],
  ];

  for (const [input, hours, minutes] of twentyFourHour) {
    it(`parses "${input}" as 24-hour`, () => {
      const result = parseClockTime(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({
          hours,
          minutes,
          seconds: 0,
          period: null,
        });
      }
    });
  }

  it("maps 6 am → 06:00 (minutes since midnight 360)", () => {
    const result = parseClockTime("6 am");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(to24Hour(result.value)).toEqual({
        hours: 6,
        minutes: 0,
        seconds: 0,
        period: null,
      });
      expect(toMinutesSinceMidnight(result.value)).toBe(360);
    }
  });

  it("maps 6 pm → 18:00", () => {
    const result = parseClockTime("6 pm");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(to24Hour(result.value).hours).toBe(18);
      expect(toMinutesSinceMidnight(result.value)).toBe(1080);
    }
  });

  it("maps 10 am → 10:00", () => {
    const result = parseClockTime("10 am");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(to24Hour(result.value).hours).toBe(10);
    }
  });

  it("maps 10 pm → 22:00", () => {
    const result = parseClockTime("10 pm");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(to24Hour(result.value).hours).toBe(22);
    }
  });

  it("maps 12 am → 00:00 (midnight)", () => {
    const result = parseClockTime("12 am");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(to24Hour(result.value)).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 0,
        period: null,
      });
      expect(toMinutesSinceMidnight(result.value)).toBe(0);
    }
  });

  it("maps 12 pm → 12:00 (noon)", () => {
    const result = parseClockTime("12 pm");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(to24Hour(result.value)).toEqual({
        hours: 12,
        minutes: 0,
        seconds: 0,
        period: null,
      });
      expect(toMinutesSinceMidnight(result.value)).toBe(720);
    }
  });

  it("is case-insensitive for AM/PM (6 AM, 6 PM, 6 Am, 6 aM)", () => {
    for (const input of ["6 AM", "6 PM", "6 Am", "6 aM"]) {
      const result = parseClockTime(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.hours).toBe(6);
        expect(result.value.period).toBe(
          input.toLowerCase().includes("am") ? "AM" : "PM",
        );
      }
    }
  });

  it("handles surrounding whitespace: ' 6 pm '", () => {
    const result = parseClockTime("  6 pm  ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.hours).toBe(6);
      expect(result.value.period).toBe("PM");
    }
  });

  it("parses 10:30 PM (uppercase with minutes)", () => {
    const result = parseClockTime("10:30 PM");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        hours: 10,
        minutes: 30,
        seconds: 0,
        period: "PM",
      });
    }
  });
});

describe("parseClockTime: invalid and ambiguous inputs", () => {
  const invalid: Array<[string, string]> = [
    ["25", "INVALID_FORMAT"],
    ["25:00", "INVALID_HOURS"],
    ["13:70", "INVALID_MINUTES"],
    ["6:90", "INVALID_MINUTES"],
    ["13 PM", "INVALID_HOURS"],
    ["0 PM", "INVALID_HOURS"],
    ["12:75 PM", "INVALID_MINUTES"],
  ];

  for (const [input, code] of invalid) {
    it(`rejects "${input}" with ${code}`, () => {
      const result = parseClockTime(input);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe(code);
      }
    });
  }

  it('rejects ambiguous hour-only "6" with INVALID_FORMAT', () => {
    const result = parseClockTime("6");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_FORMAT");
    }
  });

  it('mentions AM/PM guidance in the ambiguous "6" error message', () => {
    const result = parseClockTime("6");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toMatch(/AM or PM/i);
    }
  });
});

describe("isValidClockTime", () => {
  it("returns true for valid time", () => {
    expect(isValidClockTime({ hours: 9, minutes: 30, seconds: 0, period: null })).toBe(true);
  });

  it("returns true for time with period", () => {
    expect(isValidClockTime({ hours: 9, minutes: 30, seconds: 0, period: "AM" })).toBe(true);
  });

  it("returns false for invalid hours", () => {
    expect(isValidClockTime({ hours: 24, minutes: 0, seconds: 0, period: null })).toBe(false);
  });

  it("returns false for invalid minutes", () => {
    expect(isValidClockTime({ hours: 9, minutes: 60, seconds: 0, period: null })).toBe(false);
  });
});

describe("to24Hour", () => {
  it("converts 12:00 AM to 00:00", () => {
    expect(to24Hour({ hours: 12, minutes: 0, seconds: 0, period: "AM" })).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });

  it("converts 12:00 PM to 12:00", () => {
    expect(to24Hour({ hours: 12, minutes: 0, seconds: 0, period: "PM" })).toEqual({
      hours: 12,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });

  it("converts 1:00 PM to 13:00", () => {
    expect(to24Hour({ hours: 1, minutes: 0, seconds: 0, period: "PM" })).toEqual({
      hours: 13,
      minutes: 0,
      seconds: 0,
      period: null,
    });
  });

  it("converts 11:59 PM to 23:59", () => {
    expect(to24Hour({ hours: 11, minutes: 59, seconds: 0, period: "PM" })).toEqual({
      hours: 23,
      minutes: 59,
      seconds: 0,
      period: null,
    });
  });

  it("leaves 24-hour time unchanged", () => {
    const time = { hours: 14, minutes: 30, seconds: 0, period: null };
    expect(to24Hour(time)).toEqual(time);
  });
});

describe("to12Hour", () => {
  it("converts 00:00 to 12:00 AM", () => {
    expect(to12Hour({ hours: 0, minutes: 0, seconds: 0, period: null })).toEqual({
      hours: 12,
      minutes: 0,
      seconds: 0,
      period: "AM",
    });
  });

  it("converts 12:00 to 12:00 PM", () => {
    expect(to12Hour({ hours: 12, minutes: 0, seconds: 0, period: null })).toEqual({
      hours: 12,
      minutes: 0,
      seconds: 0,
      period: "PM",
    });
  });

  it("converts 13:00 to 1:00 PM", () => {
    expect(to12Hour({ hours: 13, minutes: 0, seconds: 0, period: null })).toEqual({
      hours: 1,
      minutes: 0,
      seconds: 0,
      period: "PM",
    });
  });

  it("converts 23:59 to 11:59 PM", () => {
    expect(to12Hour({ hours: 23, minutes: 59, seconds: 0, period: null })).toEqual({
      hours: 11,
      minutes: 59,
      seconds: 0,
      period: "PM",
    });
  });

  it("leaves 12-hour time unchanged", () => {
    const time = { hours: 9, minutes: 30, seconds: 0, period: "AM" as const };
    expect(to12Hour(time)).toEqual(time);
  });
});

describe("toSecondsSinceMidnight", () => {
  it("converts 00:00:00 to 0", () => {
    expect(toSecondsSinceMidnight({ hours: 0, minutes: 0, seconds: 0, period: null })).toBe(0);
  });

  it("converts 14:45:30 to 53130 (seconds preserved)", () => {
    expect(toSecondsSinceMidnight({ hours: 14, minutes: 45, seconds: 30, period: null })).toBe(53130);
  });

  it("converts 23:59:59 to 86399", () => {
    expect(toSecondsSinceMidnight({ hours: 23, minutes: 59, seconds: 59, period: null })).toBe(86399);
  });

  it("treats 12:00 AM as 0 seconds", () => {
    expect(toSecondsSinceMidnight({ hours: 12, minutes: 0, seconds: 0, period: "AM" })).toBe(0);
  });

  it("treats 12:00 PM as 43200 seconds", () => {
    expect(toSecondsSinceMidnight({ hours: 12, minutes: 0, seconds: 0, period: "PM" })).toBe(43200);
  });

  it("applies PM offset to 12-hour times with seconds", () => {
    expect(toSecondsSinceMidnight({ hours: 2, minutes: 30, seconds: 45, period: "PM" })).toBe(52245);
  });

  it("treats missing seconds as 0", () => {
    expect(toSecondsSinceMidnight({ hours: 9, minutes: 30, period: null } as never)).toBe(34200);
  });
});
