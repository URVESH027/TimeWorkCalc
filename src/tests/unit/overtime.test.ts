import { describe, it, expect } from "vitest";
import {
  calculateOvertime,
  formatCurrency,
} from "@/lib/overtime";
import type { OvertimeInput, OvertimeResult } from "@/lib/overtime";

function base(overrides: Partial<OvertimeInput> = {}): OvertimeInput {
  return {
    hourlyRate: "20",
    hoursWorked: "45",
    overtimeThreshold: "40",
    overtimeMultiplier: "1.5",
    ...overrides,
  };
}

function calc(overrides: Partial<OvertimeInput> = {}): OvertimeResult {
  const result = calculateOvertime(base(overrides));
  if (!result.ok) {
    throw new Error(`Expected ok result: ${result.error.message}`);
  }
  return result.value;
}

describe("calculateOvertime — spec examples", () => {
  it("1. 40 hours at $20 with threshold 40 → no overtime", () => {
    const r = calc({ hoursWorked: "40" });
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(0);
    expect(r.regularPay).toBe(800);
    expect(r.overtimeRate).toBe(30);
    expect(r.overtimePay).toBe(0);
    expect(r.totalGrossPay).toBe(800);
  });

  it("2. 45 hours at $20 with threshold 40 → 40 regular + 5 overtime = $950", () => {
    const r = calc();
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(5);
    expect(r.regularPay).toBe(800);
    expect(r.overtimeRate).toBe(30);
    expect(r.overtimePay).toBe(150);
    expect(r.totalGrossPay).toBe(950);
    expect(r.hoursOverThreshold).toBe(5);
  });

  it("3. 35 hours (below threshold) → overtime 0", () => {
    const r = calc({ hoursWorked: "35" });
    expect(r.regularHours).toBe(35);
    expect(r.overtimeHours).toBe(0);
    expect(r.regularPay).toBe(700);
    expect(r.overtimePay).toBe(0);
    expect(r.totalGrossPay).toBe(700);
  });

  it("4. exactly 40 hours → overtime 0", () => {
    const r = calc({ hoursWorked: "40" });
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(0);
  });

  it("5. 44 hours with threshold 40 → overtime 4", () => {
    const r = calc({ hoursWorked: "44" });
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(4);
    expect(r.totalGrossPay).toBe(920);
  });

  it("6. custom threshold: 45 hours, threshold 44 → overtime 1", () => {
    const r = calc({ overtimeThreshold: "44" });
    expect(r.regularHours).toBe(44);
    expect(r.overtimeHours).toBe(1);
    expect(r.regularPay).toBe(880);
    expect(r.overtimePay).toBe(30);
    expect(r.totalGrossPay).toBe(910);
  });

  it("7. multiplier 2 → overtime rate 40, overtime pay 200", () => {
    const r = calc({ overtimeMultiplier: "2" });
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(5);
    expect(r.overtimeRate).toBe(40);
    expect(r.overtimePay).toBe(200);
    expect(r.totalGrossPay).toBe(1000);
  });

  it("8. decimal hours: 42.5 → 40 regular + 2.5 overtime", () => {
    const r = calc({ hoursWorked: "42.5" });
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(2.5);
    expect(r.regularPay).toBe(800);
    expect(r.overtimePay).toBe(75);
    expect(r.totalGrossPay).toBe(875);
  });

  it("9. decimal hourly rate (no premature rounding)", () => {
    const r = calc({ hourlyRate: "20.75", hoursWorked: "42.5" });
    expect(r.regularPay).toBe(830);
    expect(r.overtimeRate).toBe(31.125);
    expect(r.overtimePay).toBe(77.8125);
    expect(r.totalGrossPay).toBe(907.8125);
  });

  it("10. zero hourly rate → valid zero pay, zero overtime pay", () => {
    const r = calc({ hourlyRate: "0" });
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(5);
    expect(r.regularPay).toBe(0);
    expect(r.overtimePay).toBe(0);
    expect(r.totalGrossPay).toBe(0);
  });
});

describe("calculateOvertime — validation", () => {
  it("11. rejects negative hourly rate", () => {
    const result = calculateOvertime(base({ hourlyRate: "-1" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NEGATIVE");
      expect(result.error.message).toBe("Hourly rate cannot be negative.");
    }
  });

  it("12. rejects negative hours worked", () => {
    const result = calculateOvertime(base({ hoursWorked: "-5" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("Hours worked cannot be negative.");
    }
  });

  it("13. rejects zero and negative thresholds", () => {
    const zero = calculateOvertime(base({ overtimeThreshold: "0" }));
    expect(zero.ok).toBe(false);
    if (!zero.ok) {
      expect(zero.error.message).toBe(
        "Overtime threshold must be greater than 0.",
      );
    }

    const negative = calculateOvertime(base({ overtimeThreshold: "-40" }));
    expect(negative.ok).toBe(false);
    if (!negative.ok) {
      expect(negative.error.message).toBe(
        "Overtime threshold must be greater than 0.",
      );
    }
  });

  it("14. rejects zero and negative multipliers", () => {
    const zero = calculateOvertime(base({ overtimeMultiplier: "0" }));
    expect(zero.ok).toBe(false);
    if (!zero.ok) {
      expect(zero.error.message).toBe(
        "Overtime multiplier must be greater than 0.",
      );
    }

    const negative = calculateOvertime(base({ overtimeMultiplier: "-1.5" }));
    expect(negative.ok).toBe(false);
    if (!negative.ok) {
      expect(negative.error.message).toBe(
        "Overtime multiplier must be greater than 0.",
      );
    }
  });

  it("15. rejects missing values for every field", () => {
    const emptyFields: Array<keyof OvertimeInput> = [
      "hourlyRate",
      "hoursWorked",
      "overtimeThreshold",
      "overtimeMultiplier",
    ];
    for (const field of emptyFields) {
      const result = calculateOvertime(base({ [field]: "" }));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("REQUIRED");
        expect(result.error.message).toMatch(/is required\.$/);
      }
    }
  });

  it("16. rejects NaN and non-finite values", () => {
    const inputs = [
      { hourlyRate: "abc" },
      { hourlyRate: "Infinity" },
      { hoursWorked: "NaN" },
      { overtimeThreshold: "abc" },
      { overtimeMultiplier: "Infinity" },
    ];
    for (const overrides of inputs) {
      const result = calculateOvertime(base(overrides));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("NOT_FINITE");
        expect(result.error.message).toMatch(/must be a valid number\.$/);
      }
    }
  });

  it("17. very large but finite values stay finite", () => {
    const r = calc({
      hourlyRate: "1000000",
      hoursWorked: "10000000",
      overtimeMultiplier: "1.5",
    });
    expect(Number.isFinite(r.regularPay)).toBe(true);
    expect(Number.isFinite(r.overtimePay)).toBe(true);
    expect(Number.isFinite(r.totalGrossPay)).toBe(true);
    expect(r.regularHours).toBe(40);
    expect(r.overtimeHours).toBe(9999960);
    expect(r.totalGrossPay).toBe(40000000 + 9999960 * 1500000);
  });

  it("18. valid normal input contains no NaN or Infinity anywhere", () => {
    const r = calc();
    for (const value of Object.values(r)) {
      expect(typeof value).toBe("number");
      expect(Number.isFinite(value)).toBe(true);
      expect(Number.isNaN(value)).toBe(false);
    }
  });

  it("trims surrounding whitespace", () => {
    const r = calc({ hourlyRate: " 20 ", hoursWorked: " 45 " });
    expect(r.totalGrossPay).toBe(950);
  });
});

describe("formatCurrency", () => {
  it("formats USD-style with two decimals", () => {
    expect(formatCurrency(950)).toBe("$950.00");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(31.125)).toBe("$31.13");
    expect(formatCurrency(1000)).toBe("$1000.00");
  });
});
