import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, children, className }: SectionProps) {
  const headingId = id ?? `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section aria-labelledby={headingId} className={className}>
      <h2 id={headingId} className="mb-3 text-lg font-semibold text-zinc-900">
        {title}
      </h2>
      {children}
    </section>
  );
}
