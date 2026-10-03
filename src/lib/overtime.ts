import type { EngineResult } from "@/types/time";

/**
 * Scope disclaimer shown in the UI and on the page. This tool uses a
 * user-defined weekly threshold and multiplier — it is not payroll or
 * legal advice.
 */
export const OVERTIME_DISCLAIMER =
  "This calculator uses a user-defined weekly overtime threshold and multiplier. The default 40-hour threshold and 1.5× multiplier are a simple estimate and do not model every employer, state, or overtime rule.";

export interface OvertimeInput {
  hourlyRate: string;
  hoursWorked: string;
  overtimeThreshold: string;
  overtimeMultiplier: string;
}

export interface OvertimeResult {
  regularHours: number;
  overtimeHours: number;
  hoursOverThreshold: number;
  regularPay: number;
  overtimeRate: number;
  overtimePay: number;
  totalGrossPay: number;
}

/**
 * USD-style display formatting (two decimals). Display only — internal
 * values are never rounded before arithmetic.
 */
export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * Compact number formatting for hours/multipliers (40, 42.5, 1.5).
 */
export function formatHoursNumber(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
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

/**
 * Split weekly hours into regular and overtime hours and estimate gross pay.
 *
 * - regular hours   = min(hoursWorked, overtimeThreshold)
 * - overtime hours  = max(0, hoursWorked - overtimeThreshold)
 * - regular pay     = regular hours × hourly rate
 * - overtime rate   = hourly rate × multiplier
 * - overtime pay    = overtime hours × overtime rate
 * - total gross pay = regular pay + overtime pay
 *
 * No rounding is applied internally; callers format for display.
 * Normal invalid input returns an EngineResult error — nothing throws.
 */
export function calculateOvertime(
  input: OvertimeInput,
): EngineResult<OvertimeResult> {
  const fields: FieldSpec[] = [
    { label: "Hourly rate", raw: input.hourlyRate, positive: false },
    { label: "Hours worked", raw: input.hoursWorked, positive: false },
    { label: "Overtime threshold", raw: input.overtimeThreshold, positive: true },
    { label: "Overtime multiplier", raw: input.overtimeMultiplier, positive: true },
  ];

  const values: number[] = [];
  for (const field of fields) {
    const parsed = parseField(field);
    if (!parsed.ok) return parsed;
    values.push(parsed.value);
  }

  const [hourlyRate, hoursWorked, overtimeThreshold, overtimeMultiplier] =
    values;

  const regularHours = Math.min(hoursWorked, overtimeThreshold);
  const overtimeHours = Math.max(0, hoursWorked - overtimeThreshold);
  const regularPay = regularHours * hourlyRate;
  const overtimeRate = hourlyRate * overtimeMultiplier;
  const overtimePay = overtimeHours * overtimeRate;
  const totalGrossPay = regularPay + overtimePay;

  return {
    ok: true,
    value: {
      regularHours,
      overtimeHours,
      hoursOverThreshold: overtimeHours,
      regularPay,
      overtimeRate,
      overtimePay,
      totalGrossPay,
    },
  };
}
