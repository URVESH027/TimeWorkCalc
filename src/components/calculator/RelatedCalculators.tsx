import type { RelatedCalculator } from "@/types/calculator";

interface RelatedCalculatorsProps {
  calculators: RelatedCalculator[];
}

/**
 * Displays links to related calculators.
 */
export function RelatedCalculators({ calculators }: RelatedCalculatorsProps) {
  if (calculators.length === 0) return null;

  return (
    <nav aria-labelledby="related-heading" className="mt-10">
      <h2
        id="related-heading"
        className="mb-3 text-sm font-medium text-zinc-700"
      >
        Related Calculators
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {calculators.map((calc) => (
          <li key={calc.slug}>
            <a
              href={`/${calc.slug}`}
              className="block rounded-md border border-zinc-200 p-3 text-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span className="font-medium text-zinc-900">{calc.title}</span>
              <span className="mt-0.5 block text-zinc-500">
                {calc.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
