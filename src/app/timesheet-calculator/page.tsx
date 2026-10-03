import type { Metadata } from "next";
import { TimesheetCalculator } from "@/components/timesheet/TimesheetCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "timesheet-calculator",
  title: "Timesheet Calculator — Enter Hours Worked Each Day",
  description:
    "Free timesheet calculator. Enter hours worked for each day of the week and get your weekly total in hours, decimal hours, and minutes.",
  canonicalPath: "/timesheet-calculator",
});

const RELATED = [
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week with punch times" },
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours worked with breaks" },
  { slug: "hours-calculator", title: "Hours Calculator", description: "Calculate elapsed time between two times" },
  { slug: "decimal-hours-calculator", title: "Decimal Hours Calculator", description: "Convert hours and minutes to decimal" },
  { slug: "work-hours-in-a-year-calculator", title: "Work Hours in a Year Calculator", description: "Calculate annual hours from your weekly schedule" },
  { slug: "overtime-calculator", title: "Overtime Calculator", description: "Estimate overtime hours and gross pay over your threshold" },
];

export default function TimesheetCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Timesheet Calculator — Enter Hours Worked Each Day",
    "Free timesheet calculator. Enter hours worked for each day of the week and get your weekly total in hours, decimal hours, and minutes.",
    "/timesheet-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Timesheet Calculator"
        description="Enter the hours worked for each day of the week and get your weekly total in hours, decimal hours, and minutes."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Timesheet Calculator", href: "/timesheet-calculator" },
        ]}
      >
        <TimesheetCalculator />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to use this calculator
            </h2>
            <ol className="list-inside list-decimal space-y-1">
              <li>Enter the hours worked for each day of the week (e.g., 7.5 for Monday).</li>
              <li>Leave days you did not work empty.</li>
              <li>Read your weekly total in hours and minutes, decimal hours, and total minutes.</li>
              <li>Use &ldquo;Copy result&rdquo; to copy the values, or &ldquo;Reset&rdquo; to clear all days.</li>
            </ol>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Formula
            </h2>
            <p className="rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              Weekly total = Mon + Tue + Wed + Thu + Fri + Sat + Sun
            </p>
            <p className="mt-2">
              Each day&apos;s decimal hours are converted to hours and minutes,
              added together, then shown as a duration, decimal hours, and total
              minutes. Empty days count as zero.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Examples
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                7.5 + 8 + 6.5 + 8 + 7.5 = <strong>37h 30m</strong> (37.5 hours,
                2250 minutes)
              </li>
              <li>
                8 hours every weekday = <strong>40h</strong> (40 hours, 2400
                minutes)
              </li>
              <li>
                A single 4.25-hour day = <strong>4h 15m</strong> (4.25 hours,
                255 minutes)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Common mistakes
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Entering clock times (like 9:00) instead of hours worked &mdash;
                this calculator takes hours directly (9 for a 9-hour day).
              </li>
              <li>
                Counting breaks &mdash; enter the hours you actually worked, or
                subtract breaks first.
              </li>
              <li>
                Entering negative hours &mdash; days can only be 0 or greater.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I calculate my weekly hours?
                </h3>
                <p className="mt-1">
                  Add the hours worked each day. For example, 7.5 + 8 + 6.5 +
                  8 + 7.5 = 37.5 hours. Enter each day above and the total is
                  calculated for you.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What is the difference from a time card calculator?
                </h3>
                <p className="mt-1">
                  A time card calculator derives hours from clock-in and
                  clock-out times. This calculator takes the hours worked per
                  day directly &mdash; use it when you already know how many
                  hours you worked. See our{" "}
                  <a
                    href="/time-card-calculator"
                    className="text-blue-600 hover:underline"
                  >
                    Time Card Calculator
                  </a>{" "}
                  if you only have punch times.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What are decimal hours?
                </h3>
                <p className="mt-1">
                  Decimal hours express time as a single number. 7 hours 30
                  minutes = 7.5 decimal hours. Payroll systems often use decimal
                  hours to multiply by your hourly rate.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={RELATED} />
      </CalculatorShell>
    </>
  );
}
