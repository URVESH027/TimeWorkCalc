import type { ResultItem } from "@/types/calculator";

interface ResultPanelProps {
  results: ResultItem[];
}

/**
 * Displays calculation results in a clean, readable format.
 */
export function ResultPanel({ results }: ResultPanelProps) {
  if (results.length === 0) return null;

  return (
    <div
      className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
      role="region"
      aria-label="Results"
    >
      <h2 className="mb-3 text-sm font-medium text-zinc-700">Result</h2>
      <dl className="space-y-2">
        {results.map((item) => (
          <div key={item.label} className="flex items-baseline justify-between">
            <dt className="text-sm text-zinc-600">{item.label}</dt>
            <dd className="font-medium text-zinc-900">
              {item.value}
              {item.unit && (
                <span className="ml-1 text-sm text-zinc-500">{item.unit}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
