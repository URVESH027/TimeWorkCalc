import type { Metadata } from "next";
import { UnitConverterCalculator } from "@/components/converters/UnitConverterCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "hours-to-minutes",
  title: "Hours to Minutes Converter — Convert Hours to Minutes",
  description:
    "Free hours to minutes converter. Enter hours and get minutes instantly — 2.5 hours = 150 minutes. Includes formula, worked examples, and a conversion table.",
  canonicalPath: "/hours-to-minutes",
});

const RELATED = [
  { slug: "minutes-to-hours", title: "Minutes to Hours Converter", description: "Convert minutes back to hours" },
  { slug: "decimal-hours-calculator", title: "Decimal Hours Calculator", description: "Convert hours and minutes to decimal" },
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours worked with breaks" },
];

const CONVERSION_TABLE = [
  { hours: 0.25, minutes: 15, asDuration: "15 minutes" },
  { hours: 0.5, minutes: 30, asDuration: "30 minutes" },
  { hours: 0.75, minutes: 45, asDuration: "45 minutes" },
  { hours: 1, minutes: 60, asDuration: "1 hour" },
  { hours: 1.5, minutes: 90, asDuration: "1 hour 30 minutes" },
  { hours: 2, minutes: 120, asDuration: "2 hours" },
  { hours: 2.5, minutes: 150, asDuration: "2 hours 30 minutes" },
  { hours: 3, minutes: 180, asDuration: "3 hours" },
  { hours: 4, minutes: 240, asDuration: "4 hours" },
  { hours: 5, minutes: 300, asDuration: "5 hours" },
  { hours: 6, minutes: 360, asDuration: "6 hours" },
  { hours: 8, minutes: 480, asDuration: "8 hours" },
  { hours: 10, minutes: 600, asDuration: "10 hours" },
  { hours: 12, minutes: 720, asDuration: "12 hours" },
  { hours: 24, minutes: 1440, asDuration: "24 hours" },
];

export default function HoursToMinutesPage() {
  const structuredData = generateCalculatorStructuredData(
    "Hours to Minutes Converter — Convert Hours to Minutes",
    "Free hours to minutes converter. Enter hours and get minutes instantly, with hours and minutes form and a conversion table.",
    "/hours-to-minutes",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Hours to Minutes Converter"
        description="Enter a number of hours — in whole or decimal form — and get the equivalent in minutes, plus hours and minutes."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hours to Minutes Converter", href: "/hours-to-minutes" },
        ]}
      >
        <UnitConverterCalculator direction="hours-to-minutes" />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to convert hours to minutes
            </h2>
            <p>
              There are exactly 60 minutes in an hour, so converting hours to
              minutes takes a single multiplication. This works the same way
              for whole hours (3 hours) and decimal hours (2.5 hours) &mdash;
              decimal hours are the format payroll systems and timesheets use.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Formula
            </h2>
            <p className="rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              minutes = hours &times; 60
            </p>
            <p className="mt-2">
              For example: 2.5 hours &times; 60 = 150 minutes.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Worked examples
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>2.5 hours</strong> &times; 60 = <strong>150 minutes</strong>{" "}
                (2 hours 30 minutes)
              </li>
              <li>
                <strong>1.5 hours</strong> &times; 60 = <strong>90 minutes</strong>{" "}
                (1 hour 30 minutes)
              </li>
              <li>
                <strong>7.5 hours</strong> &times; 60 = <strong>450 minutes</strong>{" "}
                (7 hours 30 minutes)
              </li>
            </ul>
          </div>

          <div id="conversion-table">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Hours to minutes conversion table
            </h2>
            <p className="mb-3">
              Common hour values converted to minutes:
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Hours to minutes conversion reference
                </caption>
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Hours
                    </th>
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Minutes
                    </th>
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Hours and minutes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CONVERSION_TABLE.map((row) => (
                    <tr
                      key={row.hours}
                      className="border-b border-zinc-100 last:border-0"
                    >
                      <td className="px-4 py-2 tabular-nums">{row.hours} hours</td>
                      <td className="px-4 py-2 tabular-nums">{row.minutes} minutes</td>
                      <td className="px-4 py-2 text-zinc-500">{row.asDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I convert 2.5 hours to minutes?
                </h3>
                <p className="mt-1">
                  Multiply by 60: 2.5 &times; 60 = 150 minutes. The same rule
                  applies to any decimal hour value &mdash; 1.5 hours is 90
                  minutes and 7.5 hours is 450 minutes.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How many minutes are in half an hour?
                </h3>
                <p className="mt-1">
                  Half an hour (0.5 hours) is 30 minutes, because 0.5 &times;
                  60 = 30. A quarter of an hour (0.25) is 15 minutes.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What are decimal hours?
                </h3>
                <p className="mt-1">
                  Decimal hours express time as a single base-10 number, which
                  is what payroll systems multiply by your hourly rate. 2 hours
                  30 minutes is written as 2.5 decimal hours. Use the{" "}
                  <a
                    href="/decimal-hours-calculator"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Decimal Hours Calculator
                  </a>{" "}
                  to convert in the other direction.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How many minutes are in 24 hours?
                </h3>
                <p className="mt-1">
                  24 &times; 60 = 1,440 minutes. That is the total number of
                  minutes in one full day.
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
