import type { Metadata } from "next";
import { MilitaryTimeConverter } from "@/components/military-time/MilitaryTimeConverter";
import { MilitaryTimeChart } from "@/components/military-time/MilitaryTimeChart";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { generateCalculatorMetadata } from "@/lib/seo";
import { generateCalculatorStructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = generateCalculatorMetadata({
  slug: "military-time-converter",
  title: "Military Time Converter — 24 Hour to 12 Hour",
  description:
    "Free military time converter. Enter 1430, 14:30, or 2:30 PM and get the military, 24-hour, and 12-hour formats instantly. Includes a full conversion chart and examples.",
  canonicalPath: "/military-time-converter",
});

const RELATED = [
  { slug: "time-calculator", title: "Time Calculator", description: "Add and subtract time values" },
  { slug: "hours-calculator", title: "Hours Calculator", description: "Calculate elapsed time between two times" },
  { slug: "hours-to-minutes", title: "Hours to Minutes Converter", description: "Convert hours into minutes" },
  { slug: "minutes-to-hours", title: "Minutes to Hours Converter", description: "Convert minutes to hours and decimal" },
];

export default function MilitaryTimeConverterPage() {
  const structuredData = generateCalculatorStructuredData(
    "Military Time Converter — 24 Hour to 12 Hour",
    "Free military time converter. Enter 1430, 14:30, or 2:30 PM and get the military, 24-hour, and 12-hour formats instantly.",
    "/military-time-converter",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorShell
        title="Military Time Converter"
        description="Convert any time between military time (1430), 24-hour time (14:30), and 12-hour AM/PM time (2:30 PM). Type one value — the tool auto-detects the format and shows all three representations at once. This is a format conversion tool: it does not calculate elapsed time, hours worked, or time differences."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Military Time Converter", href: "/military-time-converter" },
        ]}
      >
        <MilitaryTimeConverter />

        <section className="mt-10 max-w-xl space-y-6 text-sm text-zinc-600">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              What is military time?
            </h2>
            <p>
              Military time is a way of expressing time using four digits on a
              24-hour clock, from 0000 to 2359, instead of a 12-hour clock with
              AM and PM. Because every time of day has exactly one number,
              there is no ambiguity — 1430 always means the same moment. It is
              used in the military, aviation, healthcare, hospitals, and
              emergency services wherever mistakes are costly.
            </p>
            <p className="mt-2">
              Military time is a format for writing a time, not a calculation.
              It does not measure elapsed time, hours worked, or the difference
              between two times.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to convert military time to standard time
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>0000 to 0059</strong> — minutes after midnight: 0030 is
                12:30 AM.
              </li>
              <li>
                <strong>0100 to 1159</strong> — the same hour with AM: 0900 is
                9:00 AM.
              </li>
              <li>
                <strong>1200</strong> — noon: 1200 is 12:00 PM.
              </li>
              <li>
                <strong>1300 to 2359</strong> — subtract 1200 and add PM: 1430
                − 1200 = 230, so 1430 is 2:30 PM.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              How to convert standard time to military time
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>PM hours (1:00–11:59 PM)</strong> — add 12 to the hour
                and drop the colon: 2:30 PM becomes 1430.
              </li>
              <li>
                <strong>Midnight</strong> — 12:00 AM becomes 0000, not 1200.
              </li>
              <li>
                <strong>Noon</strong> — 12:00 PM becomes 1200.
              </li>
              <li>
                <strong>AM hours</strong> — keep the hour and pad to four
                digits: 9:00 AM becomes 0900, never 900 or 100.
              </li>
            </ul>
          </div>

          <MilitaryTimeChart />

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Common military time examples
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>0030</strong> = 12:30 AM
              </li>
              <li>
                <strong>0600</strong> = 6:00 AM
              </li>
              <li>
                <strong>0900</strong> = 9:00 AM
              </li>
              <li>
                <strong>1200</strong> = 12:00 PM (noon)
              </li>
              <li>
                <strong>1430</strong> = 2:30 PM
              </li>
              <li>
                <strong>1700</strong> = 5:00 PM
              </li>
              <li>
                <strong>1800</strong> = 6:00 PM
              </li>
              <li>
                <strong>2359</strong> = 11:59 PM
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Midnight and noon explained
            </h2>
            <p>
              Midnight is <strong>0000</strong> (12:00 AM) — the start of a new
              day. Noon is <strong>1200</strong> (12:00 PM) — the middle of the
              day. They are 12 hours apart and never interchangeable: writing
              1200 for midnight is the most common military time mistake.
            </p>
            <p className="mt-2">
              The same rule applies after midnight and noon: 12:30 AM is 0030
              and 12:30 PM is 1230. The day runs from 0000 to 2359, and 0000
              of the next day follows 2359.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Common mistakes
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Using 1200 for midnight — that is noon; midnight is 0000.
              </li>
              <li>
                Dropping the leading zero — 1:00 AM is 0100, not 100.
              </li>
              <li>
                Adding 12 to AM hours — only PM hours (1–11 PM) gain 12.
              </li>
              <li>
                Mixing formats — 13:00 PM or 2 PM are not military time;
                military time is always four digits without AM/PM.
              </li>
              <li>
                Treating military time as a duration — it labels a time of day;
                it never measures how long something lasts.
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
                  What is 1430 in standard time?
                </h3>
                <p className="mt-1">
                  1430 is 2:30 PM. Subtract 1200 from any time from 1300 to
                  2359 and add PM: 1430 − 1200 = 230, which is 2:30.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What is 0000 in 12-hour time?
                </h3>
                <p className="mt-1">
                  0000 is 12:00 AM — midnight. Noon is 1200, which is 12:00 PM.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  What is 1:05 PM in military time?
                </h3>
                <p className="mt-1">
                  1:05 PM is 1305. Add 12 to the hour for PM times and keep
                  exactly four digits.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Is 2400 a valid military time?
                </h3>
                <p className="mt-1">
                  Some schedules use 24:00 to mark the end of a day, but the
                  24-hour clock runs from 0000 to 2359. This converter treats
                  midnight as 0000.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-800">
                  Does military time use a colon?
                </h3>
                <p className="mt-1">
                  Military time is written as four digits without a colon
                  (1430). The same time on a 24-hour clock is often shown with
                  a colon (14:30) — both mean the same moment.
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
