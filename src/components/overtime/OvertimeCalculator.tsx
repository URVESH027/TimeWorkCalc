"use client";

import { useState, useCallback } from "react";
import {
  NumberInput,
  ResultCard,
  CopyButton,
  ResetButton,
} from "@/components/calculator";
import {
  calculateOvertime,
  formatCurrency,
  formatHoursNumber,
  OVERTIME_DISCLAIMER,
} from "@/lib/overtime";
import type { OvertimeInput, OvertimeResult } from "@/lib/overtime";

const DEFAULTS: OvertimeInput = {
  hourlyRate: "",
  hoursWorked: "40",
  overtimeThreshold: "40",
  overtimeMultiplier: "1.5",
};

function formatHoursCount(value: number): string {
  return `${formatHoursNumber(value)} hour${value === 1 ? "" : "s"}`;
}

function buildCopyText(
  input: OvertimeInput,
  result: OvertimeResult,
): string {
  const rate = Number(input.hourlyRate.trim());
  const hours = Number(input.hoursWorked.trim());
  const threshold = Number(input.overtimeThreshold.trim());
  const multiplier = Number(input.overtimeMultiplier.trim());

  return [
    `Hourly rate: ${formatCurrency(rate)}`,
    `Hours worked: ${formatHoursNumber(hours)}`,
    `Overtime threshold: ${formatHoursNumber(threshold)}`,
    `Overtime multiplier: ${formatHoursNumber(multiplier)}x`,
    `Regular hours: ${formatHoursNumber(result.regularHours)}`,
    `Overtime hours: ${formatHoursNumber(result.overtimeHours)}`,
    `Regular pay: ${formatCurrency(result.regularPay)}`,
    `Overtime rate: ${formatCurrency(result.overtimeRate)}`,
    `Overtime pay: ${formatCurrency(result.overtimePay)}`,
    `Total gross pay: ${formatCurrency(result.totalGrossPay)}`,
  ].join("\n");
}

export function OvertimeCalculator() {
  const [hourlyRate, setHourlyRate] = useState(DEFAULTS.hourlyRate);
  const [hoursWorked, setHoursWorked] = useState(DEFAULTS.hoursWorked);
  const [overtimeThreshold, setOvertimeThreshold] = useState(
    DEFAULTS.overtimeThreshold,
  );
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(
    DEFAULTS.overtimeMultiplier,
  );

  const reset = useCallback(() => {
    setHourlyRate(DEFAULTS.hourlyRate);
    setHoursWorked(DEFAULTS.hoursWorked);
    setOvertimeThreshold(DEFAULTS.overtimeThreshold);
    setOvertimeMultiplier(DEFAULTS.overtimeMultiplier);
  }, []);

  const input: OvertimeInput = {
    hourlyRate,
    hoursWorked,
    overtimeThreshold,
    overtimeMultiplier,
  };
  const anyEmpty = Object.values(input).some((v) => v.trim() === "");
  const parsed = anyEmpty ? null : calculateOvertime(input);
  const errorMsg =
    parsed !== null && !parsed.ok ? parsed.error.message : null;
  const result = parsed !== null && parsed.ok ? parsed.value : null;

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <NumberInput
          label="Hourly rate"
          value={hourlyRate}
          onChange={setHourlyRate}
          placeholder="20.00"
          min={0}
          step={0.01}
        />
        <NumberInput
          label="Total hours worked this week"
          value={hoursWorked}
          onChange={setHoursWorked}
          placeholder="45"
          min={0}
          step={0.25}
        />
        <NumberInput
          label="Overtime threshold"
          value={overtimeThreshold}
          onChange={setOvertimeThreshold}
          placeholder="40"
          min={0}
          step={0.5}
        />
        <NumberInput
          label="Overtime multiplier"
          value={overtimeMultiplier}
          onChange={setOvertimeMultiplier}
          placeholder="1.5"
          min={0}
          step={0.5}
        />
        <p className="text-xs text-zinc-500">{OVERTIME_DISCLAIMER}</p>
      </div>

      <div className="flex flex-col gap-3">
        {errorMsg && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMsg}
          </div>
        )}

        {result && (
          <ResultCard
            primaryLabel="Total gross pay"
            primaryValue={formatCurrency(result.totalGrossPay)}
            secondaryItems={[
              { label: "Regular hours", value: formatHoursCount(result.regularHours) },
              { label: "Overtime hours", value: formatHoursCount(result.overtimeHours) },
              { label: "Regular pay", value: formatCurrency(result.regularPay) },
              { label: "Overtime rate", value: formatCurrency(result.overtimeRate) },
              { label: "Overtime pay", value: formatCurrency(result.overtimePay) },
            ]}
          />
        )}

        {result && (
          <div className="flex gap-2">
            <CopyButton text={buildCopyText(input, result)} />
            <ResetButton onClick={reset} />
          </div>
        )}

        {!errorMsg && !result && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
            Enter all four values to estimate overtime hours and gross pay.
          </div>
        )}
      </div>
    </div>
  );
}
