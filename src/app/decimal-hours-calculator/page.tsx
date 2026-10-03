import type { Metadata } from "next";
import { DecimalHoursCalculator } from "@/components/calculator/DecimalHoursCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "decimal-hours-calculator",
  title: "Decimal Hours Calculator — Convert Hours & Minutes to Decimal",
  description:
    "Free decimal hours calculator. Convert between hours and minutes (7h 30m) and decimal hours (7.50). Includes conversion chart for payroll and timesheets.",
  canonicalPath: "/decimal-hours-calculator",
});

const RELATED = [
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours worked with breaks" },
  { slug: "hours-calculator", title: "Hours Calculator", description: "Calculate elapsed time between two times" },
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
  { slug: "time-calculator", title: "Time Calculator", description: "Add and subtract time values" },
  { slug: "hours-to-minutes", title: "Hours to Minutes Converter", description: "Convert hours into minutes" },
  { slug: "minutes-to-hours", title: "Minutes to Hours Converter", description: "Convert minutes to hours and decimal" },
  { slug: "timesheet-calculator", title: "Timesheet Calculator", description: "Enter hours worked each day for weekly totals" },
  { slug: "military-time-converter", title: "Military Time Converter", description: "Convert between military, 24-hour, and 12-hour time" },
];

const CONVERSION_CHART = [
  { minutes: 1, decimal: "0.02" },
  { minutes: 5, decimal: "0.08" },
  { minutes: 10, decimal: "0.17" },
  { minutes: 15, decimal: "0.25" },
  { minutes: 20, decimal: "0.33" },
  { minutes: 25, decimal: "0.42" },
  { minutes: 30, decimal: "0.50" },
  { minutes: 35, decimal: "0.58" },
  { minutes: 40, decimal: "0.67" },
  { minutes: 45, decimal: "0.75" },
  { minutes: 50, decimal: "0.83" },
  { minutes: 55, decimal: "0.92" },
  { minutes: 60, decimal: "1.00" },
];

export default function DecimalHoursCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Decimal Hours Calculator — Convert Hours & Minutes to Decimal",
    "Free decimal hours calculator. Convert between hours and minutes and decimal hours. Includes conversion chart for payroll and timesheets.",
    "/decimal-hours-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Decimal Hours Calculator"
        description="Convert between hours and minutes and decimal hours. Commonly used for payroll, timesheets, and spreadsheets."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Decimal Hours Calculator", href: "/decimal-hours-calculator" },
        ]}
      >
        <DecimalHoursCalculator />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How decimal hours work
            </h2>
            <p>
              Decimal hours express time as a single number in base 10. Instead
              of writing &ldquo;7 hours 30 minutes,&rdquo; you write
              &ldquo;7.50&rdquo; because 30 minutes is half an hour. This
              format is what payroll systems, timesheets, and spreadsheets
              actually use.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              The formula
            </h2>
            <p>
              To convert hours and minutes to decimal hours: divide the minutes
              by 60 and add the hours.
            </p>
            <p className="mt-2 rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              decimal hours = hours + (minutes &divide; 60)
            </p>
            <p className="mt-2">
              For example: 7 hours 15 minutes = 7 + (15 &divide; 60) = 7.25
              decimal hours.
            </p>
          </div>

          <div id="conversion-chart">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Minutes to decimal hours conversion chart
            </h2>
            <p className="mb-3">
              Common minute-to-decimal conversions used in payroll and
              timesheets:
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Minutes to decimal hours conversion reference
                </caption>
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Minutes
                    </th>
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Decimal Hours
                    </th>
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CONVERSION_CHART.map((row) => (
                    <tr
                      key={row.minutes}
                      className="border-b border-zinc-100 last:border-0"
                    >
                      <td className="px-4 py-2 tabular-nums">{row.minutes} min</td>
                      <td className="px-4 py-2 tabular-nums">{row.decimal} hours</td>
                      <td className="px-4 py-2 text-zinc-500">
                        8h {row.minutes}m = {(8 + row.minutes / 60).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Common mistake
            </h2>
            <p>
              <strong>7:30</strong> (seven hours thirty minutes) is not the same
              as <strong>7.30</strong> decimal hours.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                7 hours 30 minutes = <strong>7.50</strong> decimal hours
              </li>
              <li>
                7.30 decimal hours = 7 hours 18 minutes
              </li>
            </ul>
            <p className="mt-2">
              Never multiply an hourly rate by a time written as
              &ldquo;8.30&rdquo; thinking it means 8 hours 30 minutes. Convert
              to proper decimal hours first.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              When to use decimal hours
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Payroll</strong> &mdash; employers multiply decimal hours
                by your hourly rate to calculate pay.
              </li>
              <li>
                <strong>Timesheets</strong> &mdash; most digital timesheets
                record hours in decimal format.
              </li>
              <li>
                <strong>Invoicing</strong> &mdash; freelancers bill clients
                using decimal hours for accurate time tracking.
              </li>
              <li>
                <strong>Spreadsheets</strong> &mdash; Excel and Google Sheets
                use decimal hours for time arithmetic.
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
                  How do I convert 8 hours 45 minutes to decimal hours?
                </h3>
                <p className="mt-1">
                  Divide the minutes by 60 and add the hours: 45 &divide; 60 =
                  0.75, so 8 hours 45 minutes = <strong>8.75</strong> decimal
                  hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I convert decimal hours back to hours and minutes?
                </h3>
                <p className="mt-1">
                  Multiply the fractional part by 60: 0.75 &times; 60 = 45, so
                  8.75 decimal hours = 8 hours 45 minutes. Use the
                  calculator&apos;s conversion direction switch to do it
                  instantly.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Why does payroll use decimal hours?
                </h3>
                <p className="mt-1">
                  Payroll multiplies hours by an hourly rate: 7.5 &times; $20 =
                  $150. A time written as &ldquo;7:30&rdquo; would break that
                  math, so systems store hours in decimal form.
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
