import type { Metadata } from "next";
import { OvertimeCalculator } from "@/components/overtime/OvertimeCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";
import { OVERTIME_DISCLAIMER } from "@/lib/overtime";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "overtime-calculator",
  title: "Overtime Calculator — Hours Over 40 & Overtime Pay",
  description:
    "Free overtime calculator. Split weekly hours into regular hours and overtime hours, then estimate gross pay with your own threshold and multiplier (defaults: 40 hours, 1.5×).",
  canonicalPath: "/overtime-calculator",
});

const RELATED = [
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours worked with breaks" },
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
  { slug: "timesheet-calculator", title: "Timesheet Calculator", description: "Enter hours worked each day for weekly totals" },
  { slug: "work-hours-in-a-year-calculator", title: "Work Hours in a Year Calculator", description: "Calculate annual hours from your weekly schedule" },
];

export default function OvertimeCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Overtime Calculator — Hours Over 40 & Overtime Pay",
    "Free overtime calculator. Split weekly hours into regular hours and overtime hours and estimate gross pay with a user-defined threshold and multiplier.",
    "/overtime-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Overtime Calculator"
        description="Split your weekly hours into regular hours and overtime hours and estimate gross pay. Hours up to your overtime threshold are paid at your hourly rate; hours over the threshold are paid at the rate times your overtime multiplier (time and a half at the default 1.5×). The result is a gross estimate — it does not include taxes or deductions."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Overtime Calculator", href: "/overtime-calculator" },
        ]}
      >
        <OvertimeCalculator />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to calculate overtime pay
            </h2>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                Compare hours worked this week to your overtime threshold
                (default 40).
              </li>
              <li>
                Regular hours are the hours up to the threshold; overtime
                hours are the hours over it.
              </li>
              <li>Multiply regular hours by your hourly rate for regular pay.</li>
              <li>
                Multiply your hourly rate by the overtime multiplier to get
                the overtime rate, then multiply by overtime hours for
                overtime pay.
              </li>
              <li>Add regular pay and overtime pay for total gross pay.</li>
            </ol>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Overtime formula
            </h2>
            <div className="space-y-1 rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              <p>regular hours = min(hours worked, threshold)</p>
              <p>overtime hours = max(0, hours worked − threshold)</p>
              <p>regular pay = regular hours × hourly rate</p>
              <p>overtime rate = hourly rate × multiplier</p>
              <p>overtime pay = overtime hours × overtime rate</p>
              <p>total gross pay = regular pay + overtime pay</p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Regular hours vs overtime hours
            </h2>
            <p>
              Regular hours are paid at your plain hourly rate. Overtime
              hours are the hours over your threshold, paid at the hourly
              rate times the overtime multiplier. If you work 45 hours with a
              40-hour threshold, 40 hours are regular and 5 are overtime. If
              you work 35 hours, all 35 are regular and overtime hours are 0.
              With a custom threshold of 44 hours, 45 hours of work means 44
              regular hours and 1 overtime hour.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Overtime pay example
            </h2>
            <p>
              Hourly rate $20, hours worked 45, threshold 40, multiplier
              1.5×:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Regular pay: 40 × $20 = $800.00</li>
              <li>Overtime rate: $20 × 1.5 = $30.00</li>
              <li>Overtime pay: 5 × $30 = $150.00</li>
              <li>Total gross pay: $800 + $150 = $950.00</li>
            </ul>
            <p className="mt-2">
              With a 2× multiplier, the overtime rate becomes $40.00, the 5
              overtime hours pay $200.00, and the total is $1,000.00.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How the 40-hour threshold works in this calculator
            </h2>
            <p>
              The 40-hour threshold is the default value of an editable input
              field, not a built-in rule. This calculator uses a user-defined
              weekly overtime threshold: hours over whatever number you enter
              are treated as overtime. Set it to 45 and only hours over 45
              count. Employer and state rules can differ from any single
              weekly threshold, so check your own schedule or agreement for
              how overtime actually applies to you.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Overtime multiplier explained
            </h2>
            <p>
              The overtime multiplier scales the hourly rate for overtime
              hours. At 1.5× — often called time and a half — a $20 hourly
              rate becomes a $30 overtime rate. At 2×, double time, it
              becomes $40. Any positive multiplier is supported; 1.5 and 2
              are the most common values.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Important limitations
            </h2>
            <p>{OVERTIME_DISCLAIMER}</p>
            <p className="mt-2">
              This tool produces a gross pay estimate only. It does not
              calculate taxes, withholding, deductions, net pay, or benefits,
              and it does not determine employee classification, exemptions,
              daily overtime rules, or double-time eligibility. It is not
              payroll or legal advice.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I calculate overtime pay for 45 hours at $20?
                </h3>
                <p className="mt-1">
                  Split at the threshold: 40 regular hours × $20 = $800.00
                  plus 5 overtime hours × $30.00 = $150.00, for a total gross
                  pay of $950.00.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What is time and a half of $20 an hour?
                </h3>
                <p className="mt-1">
                  $30.00. Time and a half means the 1.5× multiplier: $20 ×
                  1.5 = $30.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Is there overtime when I work exactly 40 hours?
                </h3>
                <p className="mt-1">
                  Not in this calculator. Overtime hours start after hours
                  exceed the threshold; 40 of 40 means 0 overtime hours.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Does this calculator apply state overtime rules?
                </h3>
                <p className="mt-1">
                  No. It uses your own weekly threshold and multiplier and
                  does not model state laws, daily overtime, double time, or
                  exemptions. Employer and state rules can differ.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Is the result take-home pay?
                </h3>
                <p className="mt-1">
                  No. It is a gross estimate before taxes, withholding, and
                  deductions.
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
