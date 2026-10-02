import type { Metadata } from "next";
import { TimeCalculator } from "@/components/calculator/TimeCalculator";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "time-calculator",
  title: "Time Calculator — Add, Subtract & Multiply Time",
  description:
    "Free time calculator. Add, subtract, or multiply hours, minutes, and seconds. Get results in hours, minutes, and decimal hours.",
  canonicalPath: "/time-calculator",
});

const RELATED = [
  { slug: "hours-calculator", title: "Hours Calculator", description: "Calculate elapsed time between two times" },
  { slug: "work-hours-calculator", title: "Work Hours Calculator", description: "Calculate hours worked with breaks" },
  { slug: "decimal-hours-calculator", title: "Decimal Hours Calculator", description: "Convert hours and minutes to decimal" },
  { slug: "time-card-calculator", title: "Time Card Calculator", description: "Track a full work week" },
];

export default function TimeCalculatorPage() {
  const structuredData = generateCalculatorStructuredData(
    "Time Calculator — Add, Subtract & Multiply Time",
    "Free time calculator. Add, subtract, or multiply hours, minutes, and seconds.",
    "/time-calculator",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Time Calculator"
        description="Add, subtract, or multiply time durations. Enter hours, minutes, and seconds to perform time arithmetic."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Time Calculator", href: "/time-calculator" },
        ]}
      >
        <TimeCalculator />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to use this calculator
            </h2>
            <ol className="list-inside list-decimal space-y-1">
              <li>Select an operation: Add, Subtract, or Multiply.</li>
              <li>Enter hours, minutes, and/or seconds for the first duration.</li>
              <li>For add/subtract, enter the second duration.</li>
              <li>For multiply, enter the multiplier (e.g., 2 to double).</li>
            </ol>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Examples
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Add:</strong> 1h 30m + 2h 45m = 4h 15m
              </li>
              <li>
                <strong>Subtract:</strong> 5h 00m &minus; 2h 30m = 2h 30m
              </li>
              <li>
                <strong>Multiply:</strong> 2h 15m &times; 2 = 4h 30m
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              When to use this calculator
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>Add up multiple time entries (e.g., tracking hours across tasks)</li>
              <li>Subtract to find remaining time</li>
              <li>Multiply a shift duration by the number of days</li>
              <li>Convert total time to decimal hours for billing</li>
            </ul>
          </div>
        </section>

        <RelatedCalculators calculators={RELATED} />
      </CalculatorShell>
    </>
  );
}
