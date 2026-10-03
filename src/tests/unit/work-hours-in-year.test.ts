import { describe, it, expect } from "vitest";
import {
  calculateAnnualWorkHours,
  annualHoursAt52Weeks,
  REFERENCE_WEEKLY_HOURS,
} from "@/lib/work-hours-in-year";
import type { AnnualWorkHoursInput } from "@/lib/work-hours-in-year";

function input(
  overrides: Partial<AnnualWorkHoursInput> = {},
): AnnualWorkHoursInput {
  return {
    hoursPerWeek: "40",
    weeksPerYear: "52",
    hoursPerDay: "8",
    paidHolidays: "0",
    ptoDays: "0",
    ...overrides,
  };
}

function calc(overrides: Partial<AnnualWorkHoursInput> = {}) {
  const result = calculateAnnualWorkHours(input(overrides));
  if (!result.ok) {
    throw new Error(`expected success, got: ${result.error.message}`);
  }
  return result.value;
}

function calcError(overrides: Partial<AnnualWorkHoursInput> = {}) {
  const result = calculateAnnualWorkHours(input(overrides));
  if (result.ok) throw new Error("expected an error result");
  return result.error;
}

describe("calculateAnnualWorkHours", () => {
  it("returns 2,080 scheduled and worked hours for the default 40 × 52 schedule", () => {
    const value = calc();
    expect(value.scheduledHours).toBe(2080);
    expect(value.holidayPtoHours).toBe(0);
    expect(value.workedHours).toBe(2080);
    expect(value.averageMonthlyHours).toBeCloseTo(173.3333, 3);
  });

  it("calculates 20 × 52 = 1,040 hours", () => {
    expect(calc({ hoursPerWeek: "20" }).workedHours).toBe(1040);
  });

  it("calculates 37.5 × 52 = 1,950 hours", () => {
    expect(calc({ hoursPerWeek: "37.5" }).scheduledHours).toBe(1950);
  });

  it("calculates 50 × 52 = 2,600 hours", () => {
    expect(calc({ hoursPerWeek: "50" }).scheduledHours).toBe(2600);
  });

  it("deducts 10 paid holidays at 8 hours/day = 80 hours", () => {
    const value = calc({ paidHolidays: "10" });
    expect(value.holidayPtoHours).toBe(80);
    expect(value.workedHours).toBe(2000);
  });

  it("deducts 15 PTO days at 8 hours/day = 120 hours", () => {
    const value = calc({ ptoDays: "15" });
    expect(value.holidayPtoHours).toBe(120);
    expect(value.workedHours).toBe(1960);
  });

  it("deducts holidays and PTO together", () => {
    const value = calc({ paidHolidays: "10", ptoDays: "15" });
    expect(value.holidayPtoHours).toBe(200);
    expect(value.workedHours).toBe(1880);
  });

  it("handles non-standard weekly hours", () => {
    const value = calc({ hoursPerWeek: "25" });
    expect(value.scheduledHours).toBe(1300);
    expect(value.workedHours).toBe(1300);
  });

  it("handles decimal weekly hours", () => {
    expect(calc({ hoursPerWeek: "42.5" }).scheduledHours).toBe(2210);
  });

  it("handles decimal weeks per year", () => {
    expect(calc({ weeksPerYear: "48.5" }).scheduledHours).toBe(1940);
  });

  it("rejects negative required values", () => {
    const error = calcError({ hoursPerWeek: "-40" });
    expect(error.message).toMatch(/Hours per week must be greater than 0/);
  });

  it("rejects zero required values", () => {
    const error = calcError({ hoursPerDay: "0" });
    expect(error.message).toMatch(/Hours per workday must be greater than 0/);
  });

  it("rejects negative holiday or PTO values", () => {
    const error = calcError({ paidHolidays: "-1" });
    expect(error.message).toMatch(/Paid holidays cannot be negative/);
    const ptoError = calcError({ ptoDays: "-5" });
    expect(ptoError.message).toMatch(/PTO days cannot be negative/);
  });

  it("rejects non-finite values", () => {
    const textError = calcError({ hoursPerWeek: "abc" });
    expect(textError.message).toMatch(/Hours per week must be a valid number/);
    const infiniteError = calcError({ weeksPerYear: "Infinity" });
    expect(infiniteError.message).toMatch(/Weeks per year must be a valid number/);
    const nanError = calcError({ hoursPerDay: "NaN" });
    expect(nanError.message).toMatch(/Hours per workday must be a valid number/);
  });

  it("rejects missing required values", () => {
    const error = calcError({ hoursPerWeek: "" });
    expect(error.message).toMatch(/Hours per week is required/);
  });

  it("clamps worked hours to zero when deductions exceed scheduled hours", () => {
    const value = calc({
      hoursPerWeek: "10",
      paidHolidays: "100",
      ptoDays: "100",
    });
    expect(value.scheduledHours).toBe(520);
    expect(value.holidayPtoHours).toBe(1600);
    expect(value.workedHours).toBe(0);
    expect(value.averageMonthlyHours).toBe(0);
  });

  it("calculates average monthly hours as worked ÷ 12", () => {
    const value = calc({ hoursPerWeek: "30" });
    expect(value.averageMonthlyHours).toBeCloseTo(1560 / 12, 10);
  });
});

describe("reference table calculations", () => {
  it("computes weekly hours × 52 for every reference schedule", () => {
    const annual = REFERENCE_WEEKLY_HOURS.map((hours) =>
      annualHoursAt52Weeks(hours),
    );
    expect(annual).toEqual([1040, 1560, 1820, 1950, 2080, 2340, 2600]);
  });

  it("covers the required reference schedules", () => {
    expect([...REFERENCE_WEEKLY_HOURS]).toEqual([
      20, 30, 35, 37.5, 40, 45, 50,
    ]);
  });
});
