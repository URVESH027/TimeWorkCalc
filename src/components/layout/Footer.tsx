import Link from "next/link";

const SITE_NAME = "TimeWorkCalc";

const CALCULATORS = [
  { href: "/time-card-calculator", label: "Time Card Calculator" },
  { href: "/work-hours-calculator", label: "Work Hours Calculator" },
  { href: "/hours-calculator", label: "Hours Calculator" },
  { href: "/time-calculator", label: "Time Calculator" },
  { href: "/decimal-hours-calculator", label: "Decimal Hours Calculator" },
];

const RESOURCES = [
  { href: "/decimal-hours-calculator#conversion-chart", label: "Decimal Hours Chart" },
];

const LEGAL = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 text-sm sm:grid-cols-3">
          <div>
            <h2 className="mb-2 font-semibold text-zinc-900">Calculators</h2>
            <ul className="space-y-1">
              {CALCULATORS.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="inline-block py-1 text-zinc-500 hover:text-zinc-900"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-zinc-900">Resources</h2>
            <ul className="space-y-1">
              {RESOURCES.map((res) => (
                <li key={res.href}>
                  <Link
                    href={res.href}
                    className="inline-block py-1 text-zinc-500 hover:text-zinc-900"
                  >
                    {res.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mb-2 mt-4 font-semibold text-zinc-900">Legal</h2>
            <ul className="space-y-1">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-zinc-500 hover:text-zinc-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{SITE_NAME}</p>
            <p className="mt-2 text-zinc-500">
              Free time &amp; work-hours calculators. All calculations run in
              your browser.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Your inputs are never sent to any server. No accounts, no tracking,
              no cookies.
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
