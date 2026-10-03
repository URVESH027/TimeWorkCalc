import type { Metadata } from "next";
import { HoursCalculator } from "@/components/calculator/HoursCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "hours-calculator",
  title: "Hours Calculator — Calculate Time Between Two Times",
  description:
    "Free hours calculator. Find the elapsed time between any two times. Get results in hours, minutes, and decimal hours. Supports overnight shifts.",
  canonicalPath: "/hours-calculator",
});

const RELATED = [
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours worked with breaks" },
  { slug: "time-calculator", title: "Time Calculator", description: "Add and subtract time values" },
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
  { slug: "decimal-hours-calculator", title: "Decimal Hours Calculator", description: "Convert hours and minutes to decimal" },
  { slug: "military-time-converter", title: "Military Time Converter", description: "Convert between military, 24-hour, and 12-hour time" },
];

export default function HoursCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Hours Calculator — Calculate Time Between Two Times",
    "Free hours calculator. Find the elapsed time between any two times. Get results in hours, minutes, and decimal hours.",
    "/hours-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Hours Calculator"
        description="Calculate the elapsed time between two times. Enter a start and end time to see hours, minutes, and decimal hours."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hours Calculator", href: "/hours-calculator" },
        ]}
      >
        <HoursCalculator />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to use this calculator
            </h2>
            <ol className="list-inside list-decimal space-y-1">
              <li>Enter a start time (e.g., 8:30 AM).</li>
              <li>Enter an end time (e.g., 5:30 PM).</li>
              <li>Enable &ldquo;Overnight shift&rdquo; if the end time is on the next day.</li>
            </ol>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Formula
            </h2>
            <p className="rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-800">
              Elapsed time = End time &minus; Start time
            </p>
            <p className="mt-2">
              Both times are converted to seconds since midnight, then
              subtracted. If overnight is enabled and the end time is earlier
              than the start time, 24 hours (86,400 seconds) is added to the
              end time before subtracting.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Examples
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                8:30 AM to 5:30 PM = <strong>9 hours</strong> (9.00 decimal
                hours, 540 minutes)
              </li>
              <li>
                9:00 AM to 5:00 PM = <strong>8 hours</strong> (8.00 decimal
                hours)
              </li>
              <li>
                7:15 AM to 3:45 PM = <strong>8 hours 30 minutes</strong> (8.50
                decimal hours)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Overnight shifts
            </h2>
            <p>
              Enable the overnight option if your end time is on the next day.
              For example, 10:00 PM to 6:00 AM = 8 hours when overnight is
              enabled. Without overnight mode, the calculator expects the end
              time to be after the start time on the same day.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              When to use this calculator
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>Calculate elapsed time for a shift or meeting</li>
              <li>Find the duration of a trip or commute</li>
              <li>Track study or exercise sessions</li>
              <li>Convert between clock times and decimal hours</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-zinc-800">
                  What if the end time is earlier than the start time?
                </h3>
                <p className="mt-1">
                  Enable &ldquo;Overnight shift&rdquo; to measure across
                  midnight &mdash; for example, 10:00 PM to 6:00 AM = 8 hours.
                  Without it, the calculator expects the end time to be after
                  the start time on the same day.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What time formats can I enter?
                </h3>
                <p className="mt-1">
                  Both 12-hour times with AM/PM (8:30 AM) and 24-hour times
                  (08:30 or 17:30) work in the start and end fields.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  How do I subtract a break from elapsed time?
                </h3>
                <p className="mt-1">
                  This calculator measures raw elapsed time. To deduct unpaid
                  breaks and get hours actually worked, use the{" "}
                  <a
                    href="/work-hours-calculator"
                    className="text-blue-600 hover:underline"
                  >
                    Work Hours Calculator
                  </a>
                  .
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
