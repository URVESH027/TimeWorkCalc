import type { EngineResult } from "@/types/time";

export interface AnnualWorkHoursInput {
  hoursPerWeek: string;
  weeksPerYear: string;
  hoursPerDay: string;
  paidHolidays: string;
  ptoDays: string;
}

export interface AnnualWorkHours {
  scheduledHours: number;
  holidayPtoHours: number;
  workedHours: number;
  averageMonthlyHours: number;
}

export const REFERENCE_WEEKLY_HOURS = [20, 30, 35, 37.5, 40, 45, 50] as const;

export function annualHoursAt52Weeks(hoursPerWeek: number): number {
  return hoursPerWeek * 52;
}

export function formatAnnualHours(hours: number): string {
  return hours.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

interface FieldSpec {
  label: string;
  raw: string;
  positive: boolean;
}

function parseField(field: FieldSpec): EngineResult<number> {
  const trimmed = field.raw.trim();

  if (trimmed === "") {
    return {
      ok: false,
      error: { code: "REQUIRED", message: `${field.label} is required.` },
    };
  }

  const value = Number(trimmed);

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: "NOT_FINITE",
        message: `${field.label} must be a valid number.`,
      },
    };
  }

  if (field.positive && value <= 0) {
    return {
      ok: false,
      error: {
        code: "NOT_POSITIVE",
        message: `${field.label} must be greater than 0.`,
      },
    };
  }

  if (!field.positive && value < 0) {
    return {
      ok: false,
      error: { code: "NEGATIVE", message: `${field.label} cannot be negative.` },
    };
  }

  return { ok: true, value };
}

export function calculateAnnualWorkHours(
  input: AnnualWorkHoursInput,
): EngineResult<AnnualWorkHours> {
  const fields: FieldSpec[] = [
    { label: "Hours per week", raw: input.hoursPerWeek, positive: true },
    { label: "Weeks per year", raw: input.weeksPerYear, positive: true },
    { label: "Hours per workday", raw: input.hoursPerDay, positive: true },
    { label: "Paid holidays", raw: input.paidHolidays, positive: false },
    { label: "PTO days", raw: input.ptoDays, positive: false },
  ];

  const values: number[] = [];
  for (const field of fields) {
    const parsed = parseField(field);
    if (!parsed.ok) return parsed;
    values.push(parsed.value);
  }

  const [hoursPerWeek, weeksPerYear, hoursPerDay, paidHolidays, ptoDays] =
    values;

  const scheduledHours = hoursPerWeek * weeksPerYear;
  const holidayPtoHours = (paidHolidays + ptoDays) * hoursPerDay;
  const workedHours = Math.max(0, scheduledHours - holidayPtoHours);
  const averageMonthlyHours = workedHours / 12;

  return {
    ok: true,
    value: {
      scheduledHours,
      holidayPtoHours,
      workedHours,
      averageMonthlyHours,
    },
  };
}
