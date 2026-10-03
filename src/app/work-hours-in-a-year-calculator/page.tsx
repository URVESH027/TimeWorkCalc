import type { Metadata } from "next";
import { WorkHoursInYearCalculator } from "@/components/work-hours-in-year/WorkHoursInYearCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import {
  REFERENCE_WEEKLY_HOURS,
  annualHoursAt52Weeks,
  formatAnnualHours,
} from "@/lib/work-hours-in-year";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "work-hours-in-a-year-calculator",
  title: "Work Hours in a Year Calculator — Annual Working Hours",
  description:
    "Free work hours in a year calculator. Enter your weekly schedule, holidays, and PTO to get scheduled hours, worked hours per year, and average hours per month.",
  canonicalPath: "/work-hours-in-a-year-calculator",
});

const RELATED = [
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours worked for a single shift" },
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
  { slug: "timesheet-calculator", title: "Timesheet Calculator", description: "Enter hours worked each day for weekly totals" },
  { slug: "hours-calculator", title: "Hours Calculator", description: "Calculate elapsed time between two times" },
  { slug: "overtime-calculator", title: "Overtime Calculator", description: "Estimate overtime hours and gross pay over your threshold" },
];

export default function WorkHoursInYearCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Work Hours in a Year Calculator — Annual Working Hours",
    "Free work hours in a year calculator. Enter your weekly schedule, holidays, and PTO to get scheduled hours, worked hours per year, and average hours per month.",
    "/work-hours-in-a-year-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Work Hours in a Year Calculator"
        description="Calculate how many hours you work in a year from your weekly schedule. The familiar 2,080 figure is simply 40 hours × 52 weeks — this calculator adjusts for your hours, holidays, and PTO."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work Hours in a Year Calculator", href: "/work-hours-in-a-year-calculator" },
        ]}
      >
        <WorkHoursInYearCalculator />

        <section className="mt-10 max-w-xl" aria-labelledby="reference-heading">
          <h2
            id="reference-heading"
            className="text-lg font-semibold text-zinc-900"
          >
            Annual hours at 52 weeks
          </h2>
          <table className="mt-3 w-full text-sm text-zinc-600">
            <thead>
              <tr className="border-b border-zinc-200 text-left">
                <th className="py-2 pr-4 font-medium text-zinc-700">
                  Hours per week
                </th>
                <th className="py-2 font-medium text-zinc-700">
                  Annual hours at 52 weeks
                </th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_WEEKLY_HOURS.map((hours) => (
                <tr key={hours} className="border-b border-zinc-100">
                  <td className="py-1.5 pr-4">{hours} hours</td>
                  <td className="py-1.5 tabular-nums">
                    {formatAnnualHours(annualHoursAt52Weeks(hours))} hours
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-zinc-500">
            Annual hours at 52 weeks = weekly hours × 52. These are scheduled
            hours before holiday and PTO deductions.
          </p>
        </section>

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to calculate work hours in a year
            </h2>
            <ol className="list-inside list-decimal space-y-1">
              <li>Enter the hours you work per week (e.g., 40).</li>
              <li>Enter the weeks you work per year (52 for a full year).</li>
              <li>Enter your hours per workday (e.g., 8).</li>
              <li>
                Enter paid holidays and PTO days as work days — they are
                deducted automatically.
              </li>
              <li>
                Read your scheduled hours, holiday/PTO hours, worked hours per
                year, and average hours per month.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Work hours formula
            </h2>
            <div className="space-y-2 rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              <p>Scheduled hours = Hours per week × Weeks per year</p>
              <p>
                Worked hours = Scheduled hours − (Paid holidays + PTO days) ×
                Hours per workday
              </p>
              <p>Average monthly hours = Worked hours ÷ 12</p>
            </div>
            <p className="mt-2">
              Days are converted to hours with your own workday length:
              workdays per week = hours per week ÷ hours per workday. At 40
              hours a week and 8-hour days, that is 5 workdays per week, or 260
              workdays across 52 weeks.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Common annual work-hour examples
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                40 hours × 52 weeks = <strong>2,080 hours</strong> scheduled
              </li>
              <li>
                37.5 hours × 52 weeks = <strong>1,950 hours</strong> scheduled
              </li>
              <li>
                30 hours × 52 weeks = <strong>1,560 hours</strong> scheduled
              </li>
              <li>
                40 hours/week with 10 holidays + 15 PTO days at 8 hours/day:
                2,080 − 200 = <strong>1,880 hours worked</strong>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How holidays and PTO affect annual hours
            </h2>
            <p>
              Scheduled hours ignore time off; worked hours subtract it. Each
              holiday or PTO day removes one workday of hours (day × hours per
              workday). For example, 10 paid holidays + 15 vacation days at 8
              hours a day removes 200 hours: 2,080 scheduled − 200 = 1,880
              worked hours per year.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              2,080 work hours explained
            </h2>
            <p>
              2,080 hours is what you get from one specific schedule: 40 hours
              a week × 52 weeks. It is a common payroll convention for
              converting between annual salary and hourly pay — not a legal
              requirement and not what everyone works. Part-time and
              non-standard schedules scale linearly (37.5 × 52 = 1,950), and
              your actually worked hours are lower once holidays and PTO are
              deducted.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Common mistakes
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Using 8,760 hours (365 days × 24 hours) as work hours — that
                is every hour in a calendar year, not hours worked.
              </li>
              <li>
                Assuming everyone works 2,080 hours — it only applies to a
                40 × 52 schedule.
              </li>
              <li>
                Forgetting holidays and PTO when you need hours actually
                worked, not scheduled hours.
              </li>
              <li>
                Deducting weekend days twice — the weekly hours you enter
                already exclude weekends.
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
                  How many hours a year is a 40-hour week?
                </h3>
                <p className="mt-1">
                  40 hours × 52 weeks = 2,080 scheduled hours for the year,
                  before holidays and PTO.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I calculate work hours with holidays and PTO?
                </h3>
                <p className="mt-1">
                  Multiply each holiday and PTO day by your hours per workday,
                  then subtract the total from your scheduled annual hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How many hours a month is 2,080 hours a year?
                </h3>
                <p className="mt-1">
                  2,080 ÷ 12 = 173.33 average hours per month.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How many workdays are in a year?
                </h3>
                <p className="mt-1">
                  A five-day week gives 5 × 52 = 260 scheduled workdays, before
                  holiday and PTO deductions.
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
