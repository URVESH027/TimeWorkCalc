import { describe, it, expect } from "vitest";
import { timeDifference, calculateWorkHours } from "@/lib/time/calculations";

describe("timeDifference", () => {
  describe("same-day mode", () => {
    it("09:00 → 17:30 = 8h 30m", () => {
      const result = timeDifference(
        { hours: 9, minutes: 0, seconds: 0, period: null },
        { hours: 17, minutes: 30, seconds: 0, period: null },
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.duration).toEqual({ hours: 8, minutes: 30, seconds: 0 });
        expect(result.value.totalMinutes).toBe(510);
        expect(result.value.decimalHours).toBe(8.5);
      }
    });

    it("09:00 → 09:00 = 0h 0m (same start/end)", () => {
      const result = timeDifference(
        { hours: 9, minutes: 0, seconds: 0, period: null },
        { hours: 9, minutes: 0, seconds: 0, period: null },
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.duration).toEqual({ hours: 0, minutes: 0, seconds: 0 });
        expect(result.value.totalMinutes).toBe(0);
      }
    });

    it("17:30 → 09:00 returns error in same-day mode", () => {
      const result = timeDifference(
        { hours: 17, minutes: 30, seconds: 0, period: null },
        { hours: 9, minutes: 0, seconds: 0, period: null },
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("END_BEFORE_START");
      }
    });

    it("00:00 → 23:59 = 23h 59m", () => {
      const result = timeDifference(
        { hours: 0, minutes: 0, seconds: 0, period: null },
        { hours: 23, minutes: 59, seconds: 0, period: null },
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.totalMinutes).toBe(1439);
      }
    });

    it("00:00 → 00:01 = 1 minute", () => {
      const result = timeDifference(
        { hours: 0, minutes: 0, seconds: 0, period: null },
        { hours: 0, minutes: 1, seconds: 0, period: null },
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.totalMinutes).toBe(1);
      }
    });
  });

  describe("overnight mode", () => {
    it("22:00 → 06:00 = 8h (overnight)", () => {
      const result = timeDifference(
        { hours: 22, minutes: 0, seconds: 0, period: null },
        { hours: 6, minutes: 0, seconds: 0, period: null },
        true,
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.duration).toEqual({ hours: 8, minutes: 0, seconds: 0 });
        expect(result.value.totalMinutes).toBe(480);
      }
    });

    it("23:59 → 00:01 = 2 minutes (overnight)", () => {
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

    it("09:00 → 09:00 (overnight) = 0h (no movement)", () => {
      const result = timeDifference(
        { hours: 9, minutes: 0, seconds: 0, period: null },
        { hours: 9, minutes: 0, seconds: 0, period: null },
        true,
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.duration).toEqual({ hours: 0, minutes: 0, seconds: 0 });
        expect(result.value.totalMinutes).toBe(0);
      }
    });

    it("09:00 → 17:30 (overnight, same day) = 8h 30m", () => {
      const result = timeDifference(
        { hours: 9, minutes: 0, seconds: 0, period: null },
        { hours: 17, minutes: 30, seconds: 0, period: null },
        true,
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.duration).toEqual({ hours: 8, minutes: 30, seconds: 0 });
      }
    });

    it("10:00 → 06:00 (overnight) = 20h", () => {
      const result = timeDifference(
        { hours: 10, minutes: 0, seconds: 0, period: null },
        { hours: 6, minutes: 0, seconds: 0, period: null },
        true,
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.totalMinutes).toBe(1200);
      }
    });
  });
});

describe("calculateWorkHours", () => {
  it("09:00 → 17:30 with 60m break = 7h 30m worked", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 17, minutes: 30, seconds: 0, period: null },
      [60],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.elapsed).toEqual({ hours: 8, minutes: 30, seconds: 0 });
      expect(result.value.totalBreak).toEqual({ hours: 1, minutes: 0, seconds: 0 });
      expect(result.value.worked).toEqual({ hours: 7, minutes: 30, seconds: 0 });
      expect(result.value.decimalHours).toBe(7.5);
    }
  });

  it("09:00 → 17:30 with no break = 8h 30m worked", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 17, minutes: 30, seconds: 0, period: null },
      [],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.worked).toEqual({ hours: 8, minutes: 30, seconds: 0 });
      expect(result.value.decimalHours).toBe(8.5);
    }
  });

  it("09:00 → 18:00 with 60m + 30m breaks = 8h worked", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 18, minutes: 0, seconds: 0, period: null },
      [60, 30],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.elapsed).toEqual({ hours: 9, minutes: 0, seconds: 0 });
      expect(result.value.totalBreak).toEqual({ hours: 1, minutes: 30, seconds: 0 });
      expect(result.value.worked).toEqual({ hours: 7, minutes: 30, seconds: 0 });
      expect(result.value.decimalHours).toBe(7.5);
    }
  });

  it("09:00 → 09:00 with no break = 0h worked", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 9, minutes: 0, seconds: 0, period: null },
      [],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.worked).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    }
  });

  it("break equal to elapsed returns error", () => {
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

  it("break exceeds elapsed returns error", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 10, minutes: 0, seconds: 0, period: null },
      [120],
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("BREAKS_EXCEED_ELAPSED");
    }
  });

  it("overnight work period", () => {
    const result = calculateWorkHours(
      { hours: 22, minutes: 0, seconds: 0, period: null },
      { hours: 6, minutes: 0, seconds: 0, period: null },
      [30],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.elapsed).toEqual({ hours: 8, minutes: 0, seconds: 0 });
      expect(result.value.totalBreak).toEqual({ hours: 0, minutes: 30, seconds: 0 });
      expect(result.value.worked).toEqual({ hours: 7, minutes: 30, seconds: 0 });
    }
  });
});

describe("timeDifference — seconds precision", () => {
  it("14:45:30 → 15:00:00 = 14m 30s (not 15m)", () => {
    const result = timeDifference(
      { hours: 14, minutes: 45, seconds: 30, period: null },
      { hours: 15, minutes: 0, seconds: 0, period: null },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 0, minutes: 14, seconds: 30 });
      expect(result.value.totalMinutes).toBe(14);
      expect(result.value.decimalHours).toBe(0.2417);
    }
  });

  it("15:00:00 → 14:45:30 same-day mode returns END_BEFORE_START", () => {
    const result = timeDifference(
      { hours: 15, minutes: 0, seconds: 0, period: null },
      { hours: 14, minutes: 45, seconds: 30, period: null },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("END_BEFORE_START");
    }
  });

  it("15:00:00 → 14:45:30 overnight = 23h 45m 30s", () => {
    const result = timeDifference(
      { hours: 15, minutes: 0, seconds: 0, period: null },
      { hours: 14, minutes: 45, seconds: 30, period: null },
      true,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 23, minutes: 45, seconds: 30 });
      expect(result.value.totalMinutes).toBe(1425);
    }
  });

  it("14:30:30 → 14:30:30 (same clock time with seconds) = 0", () => {
    const result = timeDifference(
      { hours: 14, minutes: 30, seconds: 30, period: null },
      { hours: 14, minutes: 30, seconds: 30, period: null },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 0, minutes: 0, seconds: 0 });
      expect(result.value.totalMinutes).toBe(0);
      expect(result.value.decimalHours).toBe(0);
    }
  });

  it("14:30:00 → 14:30:30 = 30 seconds", () => {
    const result = timeDifference(
      { hours: 14, minutes: 30, seconds: 0, period: null },
      { hours: 14, minutes: 30, seconds: 30, period: null },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 0, minutes: 0, seconds: 30 });
      expect(result.value.totalMinutes).toBe(0);
      expect(result.value.decimalHours).toBe(0.0083);
    }
  });

  it("23:59:30 → 00:00:15 overnight = 45 seconds", () => {
    const result = timeDifference(
      { hours: 23, minutes: 59, seconds: 30, period: null },
      { hours: 0, minutes: 0, seconds: 15, period: null },
      true,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 0, minutes: 0, seconds: 45 });
      expect(result.value.totalMinutes).toBe(0);
    }
  });

  it("14:45:30 → 15:00:00 overnight (same day) = 14m 30s", () => {
    const result = timeDifference(
      { hours: 14, minutes: 45, seconds: 30, period: null },
      { hours: 15, minutes: 0, seconds: 0, period: null },
      true,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 0, minutes: 14, seconds: 30 });
    }
  });

  it("minute-only input behaves exactly as before (09:00 → 17:30 = 8h 30m)", () => {
    const result = timeDifference(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 17, minutes: 30, seconds: 0, period: null },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 8, minutes: 30, seconds: 0 });
      expect(result.value.duration.seconds).toBe(0);
      expect(result.value.totalMinutes).toBe(510);
      expect(result.value.decimalHours).toBe(8.5);
    }
  });

  it("12-hour times preserve seconds", () => {
    const result = timeDifference(
      { hours: 2, minutes: 45, seconds: 30, period: "PM" },
      { hours: 3, minutes: 0, seconds: 0, period: "PM" },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.duration).toEqual({ hours: 0, minutes: 14, seconds: 30 });
    }
  });
});

describe("calculateWorkHours — seconds precision", () => {
  it("09:00:00 → 17:30:30 no break preserves seconds", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 0, period: null },
      { hours: 17, minutes: 30, seconds: 30, period: null },
      [],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.elapsed).toEqual({ hours: 8, minutes: 30, seconds: 30 });
      expect(result.value.worked).toEqual({ hours: 8, minutes: 30, seconds: 30 });
      expect(result.value.decimalHours).toBe(8.5083);
    }
  });

  it("integer-minute break subtracted from second-precision elapsed", () => {
    const result = calculateWorkHours(
      { hours: 14, minutes: 45, seconds: 30, period: null },
      { hours: 15, minutes: 30, seconds: 0, period: null },
      [30],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.elapsed).toEqual({ hours: 0, minutes: 44, seconds: 30 });
      expect(result.value.totalBreak).toEqual({ hours: 0, minutes: 30, seconds: 0 });
      expect(result.value.worked).toEqual({ hours: 0, minutes: 14, seconds: 30 });
      expect(result.value.decimalHours).toBe(0.2417);
    }
  });

  it("clock times with identical seconds yield exact minute difference", () => {
    const result = calculateWorkHours(
      { hours: 9, minutes: 0, seconds: 45, period: null },
      { hours: 17, minutes: 0, seconds: 45, period: null },
      [],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.worked).toEqual({ hours: 8, minutes: 0, seconds: 0 });
      expect(result.value.decimalHours).toBe(8);
    }
  });

  it("overnight work period with seconds", () => {
    const result = calculateWorkHours(
      { hours: 22, minutes: 30, seconds: 15, period: null },
      { hours: 6, minutes: 0, seconds: 45, period: null },
      [30],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.elapsed).toEqual({ hours: 7, minutes: 30, seconds: 30 });
      expect(result.value.worked).toEqual({ hours: 7, minutes: 0, seconds: 30 });
    }
  });
});
