"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SITE_NAME = "TimeWorkCalc";

const TOOLS = [
  { href: "/time-card-calculator", label: "Time Card Calculator", shortLabel: "Time Card" },
  { href: "/work-hours-calculator", label: "Work Hours Calculator", shortLabel: "Work Hours" },
  { href: "/hours-calculator", label: "Hours Calculator", shortLabel: "Hours" },
  { href: "/time-calculator", label: "Time Calculator", shortLabel: "Time" },
  { href: "/decimal-hours-calculator", label: "Decimal Hours Calculator", shortLabel: "Decimal" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  const toggle = useCallback(() => setMobileOpen((prev) => !prev), []);
  const close = useCallback(() => setMobileOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, close]);

  // Move focus into menu when opened
  useEffect(() => {
    if (mobileOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [mobileOpen]);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          {SITE_NAME}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {TOOLS.map((tool) => {
              const active = pathname === tool.href;
              return (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-2 py-1 text-sm transition-colors ${
                      active
                        ? "bg-zinc-100 font-medium text-zinc-900"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {tool.shortLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-zinc-600 hover:text-zinc-900 sm:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-zinc-100 px-4 pb-4 pt-2 sm:hidden"
        >
          <ul className="space-y-1">
            {TOOLS.map((tool, index) => {
              const active = pathname === tool.href;
              return (
                <li key={tool.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={tool.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`block min-h-[44px] rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    {tool.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
