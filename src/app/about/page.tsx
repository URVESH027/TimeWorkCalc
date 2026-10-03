import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";

export const metadata: Metadata = {
  title: "About TimeWorkCalc",
  description:
    "Learn about TimeWorkCalc, a free collection of time and work-hours calculators that run entirely in your browser.",
  alternates: {
    canonical: "https://www.timeworkcalc.com/about",
  },
};

export default function AboutPage() {
  return (
    <CalculatorShell
      title="About TimeWorkCalc"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ]}
    >
      <div className="max-w-xl space-y-6 text-sm text-zinc-600">
        <section>
          <p>
            TimeWorkCalc is a free collection of time and work-hours calculators.
            Every calculation runs in your browser. No data is sent to any server.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            What we offer
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Time Card Calculator</strong> &mdash; track a full work
              week with daily clock-in/out and weekly totals.
            </li>
            <li>
              <strong>Work Hours Calculator</strong> &mdash; calculate hours
              worked for a single shift with breaks.
            </li>
            <li>
              <strong>Hours Calculator</strong> &mdash; find the elapsed time
              between any two times.
            </li>
            <li>
              <strong>Time Calculator</strong> &mdash; add, subtract, and
              multiply time durations.
            </li>
            <li>
              <strong>Decimal Hours Calculator</strong> &mdash; convert between
              hours/minutes and decimal hours.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            How it works
          </h2>
          <p>
            All calculators use a built-in time calculation engine written in
            TypeScript. The engine handles 12-hour and 24-hour time formats,
            overnight shifts, break deductions, and decimal-hour conversions.
            Every calculation is performed locally in your browser using
            JavaScript.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Privacy
          </h2>
          <p>
            TimeWorkCalc does not collect, store, or transmit any personal data.
            Your inputs never leave your device. There are no accounts, no
            cookies, and no analytics tracking. See our{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Accuracy
          </h2>
          <p>
            The time calculation engine uses integer arithmetic (whole seconds)
            so durations are free of floating-point rounding. Pay and overtime
            estimates use standard decimal arithmetic and are rounded for
            display. While we strive for accuracy, these calculators are tools
            for personal reference and should not be considered official
            payroll or legal records.
          </p>
        </section>
      </div>
    </CalculatorShell>
  );
}
