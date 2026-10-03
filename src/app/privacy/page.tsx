import type { Metadata } from "next";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "TimeWorkCalc does not collect, store, or transmit any personal data. All calculations run in your browser.",
  alternates: {
    canonical: "https://www.timeworkcalc.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <CalculatorShell
      title="Privacy Policy"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy", href: "/privacy" },
      ]}
    >
      <div className="max-w-xl space-y-6 text-sm text-zinc-600">
        <section>
          <p className="text-base text-zinc-700">
            <strong>Last updated:</strong> September 2026
          </p>
          <p className="mt-2">
            TimeWorkCalc is designed with privacy as a core principle. We do not
            collect, store, or transmit any personal data.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Data collection
          </h2>
          <p>
            TimeWorkCalc does not collect any information from visitors. There
            are no forms, no accounts, and no data submission of any kind.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Browser storage
          </h2>
          <p>
            TimeWorkCalc does not use your browser&apos;s local storage or
            session storage. Your inputs are kept only in the current page and
            are discarded when you close or reload it.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Cookies
          </h2>
          <p>
            TimeWorkCalc does not use cookies or any tracking technologies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Third-party services
          </h2>
          <p>
            TimeWorkCalc does not embed any third-party scripts, analytics
            services, or advertising networks. Fonts are self-hosted, so no
            external resources are loaded at runtime.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Calculation data
          </h2>
          <p>
            All calculations are performed locally in your browser. The numbers
            you enter are processed by JavaScript running on your device and are
            never sent anywhere. If you close the page, all entered data is
            gone.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">
            Changes to this policy
          </h2>
          <p>
            If this privacy policy changes, the updated date above will be
            revised. Continued use of TimeWorkCalc after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>
      </div>
    </CalculatorShell>
  );
}
