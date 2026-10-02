import { describe, it, expect } from "vitest";
import {
  validateHour,
  validateMinute,
  validateSecond,
  validateDecimalHours,
  validateBreakMinutes,
  collectErrors,
} from "@/lib/time/validation";

describe("validateHour", () => {
  it("accepts valid 24h hours", () => {
    expect(validateHour(0).ok).toBe(true);
    expect(validateHour(12).ok).toBe(true);
    expect(validateHour(23).ok).toBe(true);
  });

  it("rejects invalid hours", () => {
    expect(validateHour(24).ok).toBe(false);
    expect(validateHour(-1).ok).toBe(false);
  });

  it("rejects non-integer", () => {
    expect(validateHour(9.5).ok).toBe(false);
  });

  it("rejects non-number", () => {
    expect(validateHour("9").ok).toBe(false);
    expect(validateHour(null).ok).toBe(false);
  });

  it("accepts valid 12h hours", () => {
    expect(validateHour(1, true).ok).toBe(true);
    expect(validateHour(12, true).ok).toBe(true);
  });

  it("rejects 0 in 12h mode", () => {
    expect(validateHour(0, true).ok).toBe(false);
  });
});

describe("validateMinute", () => {
  it("accepts valid minutes", () => {
    expect(validateMinute(0).ok).toBe(true);
    expect(validateMinute(30).ok).toBe(true);
    expect(validateMinute(59).ok).toBe(true);
  });

  it("rejects invalid minutes", () => {
    expect(validateMinute(60).ok).toBe(false);
    expect(validateMinute(-1).ok).toBe(false);
  });

  it("rejects non-integer", () => {
    expect(validateMinute(30.5).ok).toBe(false);
  });
});

describe("validateSecond", () => {
  it("accepts valid seconds", () => {
    expect(validateSecond(0).ok).toBe(true);
    expect(validateSecond(59).ok).toBe(true);
  });

  it("rejects invalid seconds", () => {
    expect(validateSecond(60).ok).toBe(false);
    expect(validateSecond(-1).ok).toBe(false);
  });
});

describe("validateDecimalHours", () => {
  it("accepts valid values", () => {
    expect(validateDecimalHours(0).ok).toBe(true);
    expect(validateDecimalHours(8.5).ok).toBe(true);
    expect(validateDecimalHours(0.25).ok).toBe(true);
  });

  it("rejects negative values", () => {
    expect(validateDecimalHours(-1).ok).toBe(false);
  });

  it("rejects non-number", () => {
    expect(validateDecimalHours("8").ok).toBe(false);
    expect(validateDecimalHours(NaN).ok).toBe(false);
    expect(validateDecimalHours(Infinity).ok).toBe(false);
  });
});

describe("validateBreakMinutes", () => {
  it("accepts valid break values", () => {
    expect(validateBreakMinutes(0).ok).toBe(true);
    expect(validateBreakMinutes(30).ok).toBe(true);
    expect(validateBreakMinutes(60).ok).toBe(true);
  });

  it("rejects negative breaks", () => {
    expect(validateBreakMinutes(-10).ok).toBe(false);
  });

  it("rejects non-integer breaks", () => {
    expect(validateBreakMinutes(15.5).ok).toBe(false);
  });
});

describe("collectErrors", () => {
  it("returns empty array for all ok results", () => {
    const results = [
      { ok: true as const, value: 1 },
      { ok: true as const, value: 2 },
    ];
    expect(collectErrors(results)).toEqual([]);
  });

  it("collects errors from failed results", () => {
    const results = [
      { ok: true as const, value: 1 },
      {
        ok: false as const,
        error: { code: "ERR1", message: "error 1" },
      },
      {
        ok: false as const,
        error: { code: "ERR2", message: "error 2" },
      },
    ];
    const errors = collectErrors(results);
    expect(errors).toHaveLength(2);
    expect(errors[0].code).toBe("ERR1");
    expect(errors[1].code).toBe("ERR2");
  });
});
