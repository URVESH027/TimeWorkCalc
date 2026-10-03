import { PageContainer } from "@/components/layout/PageContainer";
import { generateHomeMetadata } from "@/lib/seo";
import { generateWebsiteStructuredData } from "@/lib/seo/structured-data";

export const metadata = generateHomeMetadata();

const CALCULATORS = [
  {
    slug: "time-card-calculator",
    title: "Time Card Calculator",
    description: "Track a full work week with daily clock-in/out and weekly totals.",
    featured: true,
  },
  {
    slug: "work-hours-calculator",
    title: "Work Hours Calculator",
    description: "Calculate hours worked for a single shift with breaks.",
    featured: true,
  },
  {
    slug: "hours-calculator",
    title: "Hours Calculator",
    description: "Find the elapsed time between any two times.",
    featured: false,
  },
  {
    slug: "time-calculator",
    title: "Time Calculator",
    description: "Add, subtract, and multiply time durations.",
    featured: false,
  },
  {
    slug: "decimal-hours-calculator",
    title: "Decimal Hours Calculator",
    description: "Convert between hours/minutes and decimal hours.",
    featured: false,
  },
  {
    slug: "hours-to-minutes",
    title: "Hours to Minutes Converter",
    description: "Convert hours into minutes (2.5 hours = 150 minutes).",
    featured: false,
  },
  {
    slug: "minutes-to-hours",
    title: "Minutes to Hours Converter",
    description: "Convert minutes to hours, hours and minutes, and decimal hours.",
    featured: false,
  },
  {
    slug: "timesheet-calculator",
    title: "Timesheet Calculator",
    description: "Enter hours worked each day and get your weekly total.",
    featured: false,
  },
  {
    slug: "work-hours-in-a-year-calculator",
    title: "Work Hours in a Year Calculator",
    description: "Calculate your annual work hours from your weekly schedule.",
    featured: false,
  },
  {
    slug: "military-time-converter",
    title: "Military Time Converter",
    description: "Convert between military time, 24-hour time, and 12-hour AM/PM time.",
    featured: false,
  },
  {
    slug: "overtime-calculator",
    title: "Overtime Calculator",
    description: "Estimate overtime hours and gross pay over your weekly threshold.",
    featured: false,
  },
];

export default function HomePage() {
  const structuredData = generateWebsiteStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageContainer>
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Time &amp; Work-Hours Calculators
          </h1>
          <p className="mt-2 max-w-xl text-base text-zinc-600">
            Calculate time, hours worked, breaks, time cards, and decimal
            hours. All calculations run in your browser. No data is sent to
            any server.
          </p>
        </section>

        <section aria-labelledby="calculators-heading">
          <h2
            id="calculators-heading"
            className="mb-4 text-sm font-medium text-zinc-700"
          >
            Calculators
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CALCULATORS.map((calc) => (
              <li key={calc.slug}>
                <a
                  href={`/${calc.slug}`}
                  className={`block rounded-lg border p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 ${
                    calc.featured
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-zinc-200"
                  }`}
                >
                  <span className="block text-base font-medium text-zinc-900">
                    {calc.title}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-500">
                    {calc.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600">
          <h2 className="mb-2 font-semibold text-zinc-900">
            Why TimeWorkCalc?
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>No accounts required</strong> &mdash; open and use
              immediately.
            </li>
            <li>
              <strong>Private</strong> &mdash; all calculations run in your
              browser. No data leaves your device.
            </li>
            <li>
              <strong>Precise time arithmetic</strong> &mdash; durations are
              calculated in whole seconds to avoid rounding drift.
            </li>
            <li>
              <strong>Mobile-friendly</strong> &mdash; works on phones, tablets,
              and desktops.
            </li>
          </ul>
        </section>
      </PageContainer>
    </>
  );
}
