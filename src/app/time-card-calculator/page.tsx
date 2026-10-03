import type { Metadata } from "next";
import { TimeCardCalculator } from "@/components/time-card/TimeCardCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "time-card-calculator",
  title: "Time Card Calculator — Weekly Hours & Timesheet Calculator",
  description:
    "Free online time card calculator. Enter clock-in and clock-out times for each workday. Get weekly totals in hours, decimal hours, and minutes. Supports overnight shifts and breaks.",
  canonicalPath: "/time-card-calculator",
});

const RELATED = [
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours for a single shift" },
  { slug: "decimal-hours-calculator", title: "Decimal Hours Calculator", description: "Convert hours and minutes to decimal" },
  { slug: "hours-calculator", title: "Hours Calculator", description: "Find elapsed time between two times" },
  { slug: "time-calculator", title: "Time Calculator", description: "Add and subtract time values" },
  { slug: "timesheet-calculator", title: "Timesheet Calculator", description: "Enter hours worked each day for weekly totals" },
  { slug: "work-hours-in-a-year-calculator", title: "Work Hours in a Year Calculator", description: "Calculate annual hours from your weekly schedule" },
  { slug: "overtime-calculator", title: "Overtime Calculator", description: "Estimate overtime hours and gross pay over your threshold" },
];

export default function TimeCardCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Time Card Calculator — Weekly Hours & Timesheet Calculator",
    "Free online time card calculator. Enter clock-in and clock-out times for each workday. Get weekly totals in hours, decimal hours, and minutes.",
    "/time-card-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Time Card Calculator"
        description="Enter your daily clock-in and clock-out times to calculate weekly work hours, breaks, and totals."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Time Card Calculator", href: "/time-card-calculator" },
        ]}
      >
        <TimeCardCalculator />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to use this calculator
            </h2>
            <ol className="list-inside list-decimal space-y-1">
              <li>Enter your clock-in time for each workday (e.g., 9:00 AM).</li>
              <li>Enter your clock-out time (e.g., 5:30 PM).</li>
              <li>Enter any unpaid break duration in minutes (e.g., 30 for a half-hour lunch).</li>
              <li>The calculator shows worked time for each day and a weekly total.</li>
            </ol>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Formula
            </h2>
            <p>
              For each day, the calculator computes:
            </p>
            <p className="mt-2 rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              Worked time = (Clock out &minus; Clock in) &minus; Break minutes
            </p>
            <p className="mt-2">
              The weekly total sums every worked day. Results are shown in hours
              and minutes, decimal hours, and total minutes.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Worked example
            </h2>
            <p>
              Monday through Friday, 9:00 AM to 5:30 PM with a 30-minute lunch
              break each day.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Each day: 9:00 AM to 5:30 PM = 8h 30m elapsed, minus 30m break = <strong>8h 00m worked</strong></li>
              <li>Weekly total: 8h &times; 5 days = <strong>40 hours (40.00 decimal hours)</strong></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Overnight shifts
            </h2>
            <p>
              If your shift crosses midnight (for example, 10:00 PM to 6:00 AM),
              the calculator automatically detects the overnight period and
              calculates the correct duration. A 22:00 to 06:00 shift is
              correctly counted as 8 hours.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Tips for accurate time cards
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Record times as they happen</strong> &mdash; filling in a
                card from memory at the end of the week is where errors creep in.
              </li>
              <li>
                <strong>Be consistent with breaks</strong> &mdash; only enter
                unpaid breaks. If a break is paid, leave the field at 0.
              </li>
              <li>
                <strong>Use decimal hours for payroll</strong> &mdash; payroll
                systems multiply your rate by decimal hours, not hours and
                minutes. 8 hours 30 minutes = 8.50 decimal hours.
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
                  What is a time card calculator?
                </h3>
                <p className="mt-1">
                  A time card calculator totals your daily clock-in and clock-out
                  times, subtracts unpaid breaks, and gives you weekly totals in
                  hours and decimal hours. It replaces manual time sheet math.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I add up hours worked with breaks?
                </h3>
                <p className="mt-1">
                  Enter your clock-in and clock-out times, then enter your unpaid
                  break in minutes. The calculator subtracts the break from the
                  elapsed time automatically. For example, 9:00 AM to 5:30 PM
                  with a 30-minute break = 8 hours worked.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What is the difference between hours and decimal hours?
                </h3>
                <p className="mt-1">
                  Hours and minutes (8h 30m) is the human-readable format. Decimal
                  hours (8.50) is what payroll systems use. Divide minutes by 60
                  to convert: 30 minutes &divide; 60 = 0.50 decimal hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Does this handle overnight shifts?
                </h3>
                <p className="mt-1">
                  Yes. When the clock-out time is earlier than the clock-in time,
                  the calculator assumes the shift crossed midnight and adds 24
                  hours. A 10:00 PM to 6:00 AM shift is calculated as 8 hours.
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
