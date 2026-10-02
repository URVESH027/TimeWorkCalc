import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatDecimalHours,
  isNumber,
  isPositiveNumber,
  isInRange,
} from "@/lib/utils";

describe("formatNumber", () => {
  it("formats integers with comma separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats decimals", () => {
    expect(formatNumber(1234.5678, 2)).toBe("1,234.57");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatDecimalHours", () => {
  it("formats whole hours", () => {
    expect(formatDecimalHours(8)).toBe("8h 0m");
  });

  it("formats hours and minutes", () => {
    expect(formatDecimalHours(8.5)).toBe("8h 30m");
  });

  it("formats zero hours", () => {
    expect(formatDecimalHours(0)).toBe("0h 0m");
  });
});

describe("isNumber", () => {
  it("returns true for valid numbers", () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(42)).toBe(true);
    expect(isNumber(-1.5)).toBe(true);
  });

  it("returns false for invalid values", () => {
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber("42")).toBe(false);
    expect(isNumber(null)).toBe(false);
  });
});

describe("isPositiveNumber", () => {
  it("returns true for positive numbers", () => {
    expect(isPositiveNumber(1)).toBe(true);
    expect(isPositiveNumber(0.01)).toBe(true);
  });

  it("returns false for zero and negatives", () => {
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-1)).toBe(false);
  });
});

describe("isInRange", () => {
  it("returns true for values within range", () => {
    expect(isInRange(5, 1, 10)).toBe(true);
    expect(isInRange(1, 1, 10)).toBe(true);
    expect(isInRange(10, 1, 10)).toBe(true);
  });

  it("returns false for values outside range", () => {
    expect(isInRange(0, 1, 10)).toBe(false);
    expect(isInRange(11, 1, 10)).toBe(false);
  });
});
