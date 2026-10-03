import type { Metadata } from "next";
import { UnitConverterCalculator } from "@/components/converters/UnitConverterCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "minutes-to-hours",
  title: "Minutes to Hours Converter — Hours & Decimal Hours",
  description:
    "Free minutes to hours converter. Convert minutes to hours and decimal hours — 90 minutes = 1 hour 30 minutes = 1.5 hours. Includes formula, examples, and a conversion table.",
  canonicalPath: "/minutes-to-hours",
});

const RELATED = [
  { slug: "hours-to-minutes", title: "Hours to Minutes Converter", description: "Convert hours to minutes" },
  { slug: "decimal-hours-calculator", title: "Decimal Hours Calculator", description: "Convert hours and minutes to decimal" },
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
  { slug: "hours-calculator", title: "Hours Calculator", description: "Calculate elapsed time between two times" },
];

const CONVERSION_TABLE = [
  { minutes: 15, asDuration: "15 minutes", decimal: "0.25" },
  { minutes: 30, asDuration: "30 minutes", decimal: "0.5" },
  { minutes: 45, asDuration: "45 minutes", decimal: "0.75" },
  { minutes: 60, asDuration: "1 hour", decimal: "1" },
  { minutes: 75, asDuration: "1 hour 15 minutes", decimal: "1.25" },
  { minutes: 90, asDuration: "1 hour 30 minutes", decimal: "1.5" },
  { minutes: 100, asDuration: "1 hour 40 minutes", decimal: "1.6667" },
  { minutes: 120, asDuration: "2 hours", decimal: "2" },
  { minutes: 150, asDuration: "2 hours 30 minutes", decimal: "2.5" },
  { minutes: 190, asDuration: "3 hours 10 minutes", decimal: "3.1667" },
  { minutes: 240, asDuration: "4 hours", decimal: "4" },
  { minutes: 300, asDuration: "5 hours", decimal: "5" },
  { minutes: 480, asDuration: "8 hours", decimal: "8" },
  { minutes: 720, asDuration: "12 hours", decimal: "12" },
  { minutes: 1440, asDuration: "24 hours", decimal: "24" },
];

export default function MinutesToHoursPage() {
  const structuredData = generateCalculatorStructuredData(
    "Minutes to Hours Converter — Hours & Decimal Hours",
    "Free minutes to hours converter. Convert minutes to hours and decimal hours, with formula, examples, and a conversion table.",
    "/minutes-to-hours",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Minutes to Hours Converter"
        description="Enter a number of minutes and get both forms people actually need: hours and minutes (1 h 30 m) and decimal hours (1.5) for payroll."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Minutes to Hours Converter", href: "/minutes-to-hours" },
        ]}
      >
        <UnitConverterCalculator direction="minutes-to-hours" />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to convert minutes to hours
            </h2>
            <p>
              Divide the minutes by 60. The whole-number part of the result is
              the hours, and the remainder is the minutes left over. The
              fractional part, expressed as a decimal, is decimal hours &mdash;
              the format payroll systems and timesheets multiply by an hourly
              rate.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Formulas
            </h2>
            <p className="rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              hours = minutes &divide; 60
            </p>
            <p className="mt-2 rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              hours and minutes = (minutes &divide; 60) quotient and remainder
            </p>
            <p className="mt-2">
              For example: 190 &divide; 60 = 3 with a remainder of 10, so 190
              minutes = 3 hours 10 minutes = 3.1667 decimal hours.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Worked examples
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>90 minutes</strong> &divide; 60 ={" "}
                <strong>1 hour 30 minutes</strong> = <strong>1.5 hours</strong>
              </li>
              <li>
                <strong>190 minutes</strong> &divide; 60 ={" "}
                <strong>3 hours 10 minutes</strong> ={" "}
                <strong>3.1667 hours</strong>
              </li>
              <li>
                <strong>45 minutes</strong> &divide; 60 ={" "}
                <strong>45 minutes</strong> = <strong>0.75 hours</strong>
              </li>
            </ul>
          </div>

          <div id="conversion-table">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Minutes to hours conversion table
            </h2>
            <p className="mb-3">
              Common minute values in hours and minutes and as decimal hours:
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Minutes to hours conversion reference
                </caption>
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Minutes
                    </th>
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Hours and minutes
                    </th>
                    <th className="px-4 py-2 font-medium text-zinc-700">
                      Decimal hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CONVERSION_TABLE.map((row) => (
                    <tr
                      key={row.minutes}
                      className="border-b border-zinc-100 last:border-0"
                    >
                      <td className="px-4 py-2 tabular-nums">{row.minutes} minutes</td>
                      <td className="px-4 py-2 text-zinc-500">{row.asDuration}</td>
                      <td className="px-4 py-2 tabular-nums">{row.decimal} hours</td>
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
              90 minutes is <strong>1.5 hours</strong>, not 1.9 hours. Minutes
              are base-60, so you divide by 60 &mdash; you cannot put the
              minutes after the decimal point as if they were tenths.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                90 minutes = 1.5 hours (correct)
              </li>
              <li>
                &ldquo;1.90 hours&rdquo; would mean 1 hour 54 minutes
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
                  How do I convert 90 minutes to hours?
                </h3>
                <p className="mt-1">
                  Divide by 60: 90 &divide; 60 = 1.5 hours, which is 1 hour 30
                  minutes. The same rule converts 120 minutes to 2 hours and
                  45 minutes to 0.75 hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What is 190 minutes in hours?
                </h3>
                <p className="mt-1">
                  190 &divide; 60 = 3.1667 hours. Written as hours and minutes
                  that is 3 hours 10 minutes, because the 0.1667 remainder is
                  10 minutes (0.1667 &times; 60 &asymp; 10).
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Why do I need decimal hours?
                </h3>
                <p className="mt-1">
                  Payroll systems multiply your hourly rate by a single decimal
                  number, not by &ldquo;hours and minutes.&rdquo; 1 hour 30
                  minutes of work at $20/hour is 1.5 &times; $20 = $30. See the{" "}
                  <a
                    href="/decimal-hours-calculator"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Decimal Hours Calculator
                  </a>{" "}
                  for more examples.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How many hours are in a day?
                </h3>
                <p className="mt-1">
                  One day is 1,440 minutes, which is 24 hours (1,440 &divide;
                  60 = 24).
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
