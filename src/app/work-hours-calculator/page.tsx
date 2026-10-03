import type { Metadata } from "next";
import { WorkHoursCalculator } from "@/components/work-hours/WorkHoursCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "work-hours-calculator",
  title: "Work Hours Calculator — Calculate Hours Worked",
  description:
    "Free work hours calculator. Enter clock-in, clock-out, and break time. Get worked hours in hours, decimal hours, and minutes. Supports overnight shifts and pay estimates.",
  canonicalPath: "/work-hours-calculator",
});

const RELATED = [
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
  { slug: "hours-calculator", title: "Hours Calculator", description: "Calculate elapsed time between two times" },
  { slug: "decimal-hours-calculator", title: "Decimal Hours Calculator", description: "Convert hours and minutes to decimal" },
  { slug: "time-calculator", title: "Time Calculator", description: "Add and subtract time values" },
  { slug: "timesheet-calculator", title: "Timesheet Calculator", description: "Enter hours worked each day for weekly totals" },
  { slug: "work-hours-in-a-year-calculator", title: "Work Hours in a Year Calculator", description: "Calculate annual hours from your weekly schedule" },
  { slug: "overtime-calculator", title: "Overtime Calculator", description: "Estimate overtime hours and gross pay over your threshold" },
];

export default function WorkHoursCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Work Hours Calculator — Calculate Hours Worked",
    "Free work hours calculator. Enter clock-in, clock-out, and break time. Get worked hours in hours, decimal hours, and minutes.",
    "/work-hours-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Work Hours Calculator"
        description="Calculate total hours worked for a single shift. Enter your clock-in time, clock-out time, and any break duration."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work Hours Calculator", href: "/work-hours-calculator" },
        ]}
      >
        <WorkHoursCalculator />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to use this calculator
            </h2>
            <ol className="list-inside list-decimal space-y-1">
              <li>Enter your clock-in time (e.g., 9:00 AM).</li>
              <li>Enter your clock-out time (e.g., 5:30 PM).</li>
              <li>Enter any unpaid break duration in minutes (e.g., 30).</li>
              <li>Optionally check &ldquo;Calculate pay estimate&rdquo; and enter your hourly rate.</li>
            </ol>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Formula
            </h2>
            <p className="rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              Worked time = (Clock out &minus; Clock in) &minus; Break minutes
            </p>
            <p className="mt-2">
              The elapsed time is the difference between clock-out and clock-in.
              Break minutes are then subtracted to get the net worked time.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Worked example
            </h2>
            <p>
              Clock in at 9:00 AM, clock out at 5:30 PM, with a 30-minute
              lunch break.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Elapsed time: 9:00 AM to 5:30 PM = 8 hours 30 minutes</li>
              <li>Break: 30 minutes</li>
              <li>Worked: 8 hours 30 minutes &minus; 30 minutes = <strong>8 hours (8.00 decimal hours)</strong></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Overnight shifts
            </h2>
            <p>
              Working a shift that crosses midnight? The calculator handles
              overnight periods correctly. When the clock-out time is earlier
              than the clock-in time, the calculator adds 24 hours. For example,
              10:00 PM to 6:00 AM = 8 hours.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Pay estimate
            </h2>
            <p>
              Check the &ldquo;Calculate pay estimate&rdquo; option and enter
              your hourly rate to see estimated gross pay. This multiplies your
              decimal hours by the hourly rate. This is an estimate only &mdash;
              actual payroll may differ based on taxes, deductions, and
              employer-specific rules.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I calculate hours worked?
                </h3>
                <p className="mt-1">
                  Convert your clock-in and clock-out times to minutes since
                  midnight, subtract clock-in from clock-out, then subtract any
                  unpaid break minutes. Divide by 60 for decimal hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What are decimal hours?
                </h3>
                <p className="mt-1">
                  Decimal hours express time as a single decimal number. 7 hours
                  30 minutes = 7.50 decimal hours. Payroll systems use decimal
                  hours to multiply by your hourly rate. See our{" "}
                  <a
                    href="/decimal-hours-calculator"
                    className="text-blue-600 hover:underline"
                  >
                    Decimal Hours Calculator
                  </a>{" "}
                  for conversion.
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
