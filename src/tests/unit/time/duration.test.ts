import { describe, it, expect } from "vitest";
import {
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
} from "@/lib/time/duration";

describe("createDuration", () => {
  it("creates a valid duration", () => {
    const result = createDuration(8, 30);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ hours: 8, minutes: 30, seconds: 0 });
    }
  });

  it("creates a duration with seconds", () => {
    const result = createDuration(1, 15, 45);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ hours: 1, minutes: 15, seconds: 45 });
    }
  });

  it("creates a zero duration", () => {
    const result = createDuration(0, 0);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    }
  });

  it("rejects infinite hours", () => {
    const result = createDuration(Infinity, 0);
    expect(result.ok).toBe(false);
  });

  it("rejects NaN minutes", () => {
    const result = createDuration(0, NaN);
    expect(result.ok).toBe(false);
  });
});

describe("toTotalSeconds", () => {
  it("converts 0h 0m to 0", () => {
    expect(toTotalSeconds({ hours: 0, minutes: 0, seconds: 0 })).toBe(0);
  });

  it("converts 1h 0m to 3600", () => {
    expect(toTotalSeconds({ hours: 1, minutes: 0, seconds: 0 })).toBe(3600);
  });

  it("converts 0h 1m to 60", () => {
    expect(toTotalSeconds({ hours: 0, minutes: 1, seconds: 0 })).toBe(60);
  });

  it("converts 8h 30m to 30600", () => {
    expect(toTotalSeconds({ hours: 8, minutes: 30, seconds: 0 })).toBe(30600);
  });

  it("converts with seconds", () => {
    expect(toTotalSeconds({ hours: 1, minutes: 1, seconds: 1 })).toBe(3661);
  });
});

describe("fromTotalSeconds", () => {
  it("converts 0 to 0h 0m 0s", () => {
    expect(fromTotalSeconds(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });

  it("converts 3600 to 1h 0m 0s", () => {
    expect(fromTotalSeconds(3600)).toEqual({ hours: 1, minutes: 0, seconds: 0 });
  });

  it("converts 60 to 0h 1m 0s", () => {
    expect(fromTotalSeconds(60)).toEqual({ hours: 0, minutes: 1, seconds: 0 });
  });

  it("converts 30600 to 8h 30m 0s", () => {
    expect(fromTotalSeconds(30600)).toEqual({ hours: 8, minutes: 30, seconds: 0 });
  });

  it("converts 3661 to 1h 1m 1s", () => {
    expect(fromTotalSeconds(3661)).toEqual({ hours: 1, minutes: 1, seconds: 1 });
  });

  it("handles negative values", () => {
    const result = fromTotalSeconds(-3600);
    expect(result.hours).toBe(-1);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });
});

describe("addDurations", () => {
  it("adds two durations", () => {
    expect(
      addDurations(
        { hours: 1, minutes: 30, seconds: 0 },
        { hours: 2, minutes: 45, seconds: 0 },
      ),
    ).toEqual({ hours: 4, minutes: 15, seconds: 0 });
  });

  it("adds multiple durations", () => {
    expect(
      addDurations(
        { hours: 1, minutes: 0, seconds: 0 },
        { hours: 2, minutes: 0, seconds: 0 },
        { hours: 3, minutes: 0, seconds: 0 },
      ),
    ).toEqual({ hours: 6, minutes: 0, seconds: 0 });
  });

  it("adds with carry-over minutes", () => {
    expect(
      addDurations(
        { hours: 1, minutes: 45, seconds: 0 },
        { hours: 0, minutes: 30, seconds: 0 },
      ),
    ).toEqual({ hours: 2, minutes: 15, seconds: 0 });
  });

  it("adds zero durations", () => {
    expect(
      addDurations(
        { hours: 5, minutes: 0, seconds: 0 },
        { hours: 0, minutes: 0, seconds: 0 },
      ),
    ).toEqual({ hours: 5, minutes: 0, seconds: 0 });
  });

  it("adds with seconds", () => {
    expect(
      addDurations(
        { hours: 1, minutes: 0, seconds: 30 },
        { hours: 0, minutes: 0, seconds: 45 },
      ),
    ).toEqual({ hours: 1, minutes: 1, seconds: 15 });
  });
});

describe("subtractDuration", () => {
  it("subtracts where a > b", () => {
    expect(
      subtractDuration(
        { hours: 5, minutes: 0, seconds: 0 },
        { hours: 2, minutes: 30, seconds: 0 },
      ),
    ).toEqual({ hours: 2, minutes: 30, seconds: 0 });
  });

  it("returns zero when a = b", () => {
    expect(
      subtractDuration(
        { hours: 3, minutes: 0, seconds: 0 },
        { hours: 3, minutes: 0, seconds: 0 },
      ),
    ).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });

  it("returns negative when a < b", () => {
    const result = subtractDuration(
      { hours: 1, minutes: 0, seconds: 0 },
      { hours: 2, minutes: 0, seconds: 0 },
    );
    expect(result.hours).toBe(-1);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it("subtracts with borrow", () => {
    expect(
      subtractDuration(
        { hours: 3, minutes: 15, seconds: 0 },
        { hours: 1, minutes: 45, seconds: 0 },
      ),
    ).toEqual({ hours: 1, minutes: 30, seconds: 0 });
  });
});

describe("multiplyDuration", () => {
  it("multiplies by 2", () => {
    expect(
      multiplyDuration({ hours: 2, minutes: 15, seconds: 0 }, 2),
    ).toEqual({ hours: 4, minutes: 30, seconds: 0 });
  });

  it("multiplies by 1.5", () => {
    expect(
      multiplyDuration({ hours: 1, minutes: 30, seconds: 0 }, 1.5),
    ).toEqual({ hours: 2, minutes: 15, seconds: 0 });
  });

  it("multiplies by 1 (identity)", () => {
    expect(
      multiplyDuration({ hours: 3, minutes: 45, seconds: 0 }, 1),
    ).toEqual({ hours: 3, minutes: 45, seconds: 0 });
  });

  it("multiplies by 0", () => {
    expect(
      multiplyDuration({ hours: 5, minutes: 30, seconds: 0 }, 0),
    ).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });

  it("handles fractional results", () => {
    const result = multiplyDuration({ hours: 1, minutes: 0, seconds: 0 }, 0.5);
    expect(result).toEqual({ hours: 0, minutes: 30, seconds: 0 });
  });

  it("handles non-finite factor", () => {
    expect(multiplyDuration({ hours: 1, minutes: 0, seconds: 0 }, Infinity)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});

describe("divideDuration", () => {
  it("divides by 2", () => {
    const result = divideDuration({ hours: 6, minutes: 0, seconds: 0 }, 2);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ hours: 3, minutes: 0, seconds: 0 });
    }
  });

  it("divides with remainder", () => {
    const result = divideDuration({ hours: 3, minutes: 0, seconds: 0 }, 2);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ hours: 1, minutes: 30, seconds: 0 });
    }
  });

  it("divides by zero", () => {
    const result = divideDuration({ hours: 5, minutes: 0, seconds: 0 }, 0);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("DIVISION_BY_ZERO");
    }
  });

  it("divides by non-finite", () => {
    const result = divideDuration({ hours: 5, minutes: 0, seconds: 0 }, NaN);
    expect(result.ok).toBe(false);
  });
});

describe("isZeroDuration", () => {
  it("returns true for zero duration", () => {
    expect(isZeroDuration({ hours: 0, minutes: 0, seconds: 0 })).toBe(true);
  });

  it("returns false for non-zero duration", () => {
    expect(isZeroDuration({ hours: 1, minutes: 0, seconds: 0 })).toBe(false);
  });
});

describe("isNegativeDuration", () => {
  it("returns true for negative hours", () => {
    expect(isNegativeDuration({ hours: -1, minutes: 0, seconds: 0 })).toBe(true);
  });

  it("returns true for negative minutes", () => {
    expect(isNegativeDuration({ hours: 0, minutes: -30, seconds: 0 })).toBe(true);
  });

  it("returns false for positive duration", () => {
    expect(isNegativeDuration({ hours: 1, minutes: 30, seconds: 0 })).toBe(false);
  });

  it("returns false for zero duration", () => {
    expect(isNegativeDuration({ hours: 0, minutes: 0, seconds: 0 })).toBe(false);
  });
});

describe("negateDuration", () => {
  it("negates positive duration", () => {
    expect(negateDuration({ hours: 1, minutes: 30, seconds: 0 })).toEqual({
      hours: -1,
      minutes: -30,
      seconds: 0,
    });
  });

  it("negates negative duration", () => {
    expect(negateDuration({ hours: -2, minutes: -15, seconds: 0 })).toEqual({
      hours: 2,
      minutes: 15,
      seconds: 0,
    });
  });

  it("negates zero duration", () => {
    expect(negateDuration({ hours: 0, minutes: 0, seconds: 0 })).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});
