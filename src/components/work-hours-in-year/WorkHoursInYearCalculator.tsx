"use client";

import { useState, useCallback } from "react";
import {
  NumberInput,
  ResultCard,
  CopyButton,
  ResetButton,
} from "@/components/calculator";
import {
  calculateAnnualWorkHours,
  formatAnnualHours,
} from "@/lib/work-hours-in-year";
import type { AnnualWorkHours, AnnualWorkHoursInput } from "@/lib/work-hours-in-year";

const DEFAULTS: AnnualWorkHoursInput = {
  hoursPerWeek: "40",
  weeksPerYear: "52",
  hoursPerDay: "8",
  paidHolidays: "0",
  ptoDays: "0",
};

function buildCopyText(value: AnnualWorkHours): string {
  return [
    `Worked Hours Per Year: ${formatAnnualHours(value.workedHours)} hours`,
    `Scheduled Hours Per Year: ${formatAnnualHours(value.scheduledHours)} hours`,
    `Holiday/PTO Hours: ${formatAnnualHours(value.holidayPtoHours)} hours`,
    `Average Hours Per Month: ${formatAnnualHours(value.averageMonthlyHours)} hours`,
  ].join("\n");
}

export function WorkHoursInYearCalculator() {
  const [values, setValues] = useState<AnnualWorkHoursInput>(DEFAULTS);

  const setValue = useCallback(
    (key: keyof AnnualWorkHoursInput, value: string) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setValues(DEFAULTS), []);

  const allEmpty = Object.values(values).every((v) => v.trim() === "");
  const result = calculateAnnualWorkHours(values);
  const copyText = result.ok ? buildCopyText(result.value) : "";

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <NumberInput
          label="Hours per week"
          value={values.hoursPerWeek}
          onChange={(v) => setValue("hoursPerWeek", v)}
          min={0}
          step={0.5}
        />
        <NumberInput
          label="Weeks per year"
          value={values.weeksPerYear}
          onChange={(v) => setValue("weeksPerYear", v)}
          min={0}
          step={1}
        />
        <NumberInput
          label="Hours per workday"
          value={values.hoursPerDay}
          onChange={(v) => setValue("hoursPerDay", v)}
          min={0}
          step={0.5}
        />
        <NumberInput
          label="Paid holidays per year (days)"
          value={values.paidHolidays}
          onChange={(v) => setValue("paidHolidays", v)}
          min={0}
          step={1}
        />
        <NumberInput
          label="PTO / vacation days (days)"
          value={values.ptoDays}
          onChange={(v) => setValue("ptoDays", v)}
          min={0}
          step={1}
        />
        <p className="text-xs text-zinc-500">
          Holidays and PTO days are counted as work days and deducted from your
          scheduled annual hours at your hours per workday.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {!allEmpty && !result.ok && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {result.error.message}
          </div>
        )}

        {result.ok && (
          <ResultCard
            primaryLabel="Worked hours per year"
            primaryValue={`${formatAnnualHours(result.value.workedHours)} hours`}
            secondaryItems={[
              {
                label: "Scheduled hours per year",
                value: `${formatAnnualHours(result.value.scheduledHours)} hours`,
              },
              {
                label: "Holiday/PTO hours",
                value: `${formatAnnualHours(result.value.holidayPtoHours)} hours`,
              },
              {
                label: "Average hours per month",
                value: `${formatAnnualHours(result.value.averageMonthlyHours)} hours`,
              },
            ]}
          />
        )}

        {result.ok && (
          <div className="flex gap-2">
            <CopyButton text={copyText} />
            <ResetButton onClick={reset} />
          </div>
        )}

        {allEmpty && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-500">
            Enter your weekly schedule to see your annual work hours.
          </div>
        )}
      </div>
    </div>
  );
}
