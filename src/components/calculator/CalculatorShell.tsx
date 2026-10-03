import type { BreadcrumbItem } from "@/types/calculator";
import { generateBreadcrumbStructuredData } from "@/lib/seo/structured-data";

interface CalculatorShellProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

/**
 * Standard shell for calculator pages.
 * Provides title, description, breadcrumbs (UI + BreadcrumbList JSON-LD),
 * and content area. Calculator-specific input/result logic lives in child
 * components.
 */
export function CalculatorShell({
  title,
  description,
  breadcrumbs,
  children,
}: CalculatorShellProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 focus:outline-none"
      aria-labelledby="calculator-title"
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateBreadcrumbStructuredData(breadcrumbs)),
            }}
          />
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-zinc-500">
              {breadcrumbs.map((item, index) => (
                <li key={item.href} className="flex items-center gap-1">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="text-zinc-900">
                      {item.label}
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      className="inline-block py-1 hover:text-zinc-900"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </>
      )}

      <div className="mb-6">
        <h1
          id="calculator-title"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-base text-zinc-600">
            {description}
          </p>
        )}
      </div>

      {children}
    </main>
  );
}
