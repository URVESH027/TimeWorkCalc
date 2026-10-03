interface ResultCardProps {
  primaryLabel: string;
  primaryValue: string;
  secondaryItems?: Array<{ label: string; value: string }>;
}

export function ResultCard({
  primaryLabel,
  primaryValue,
  secondaryItems,
}: ResultCardProps) {
  return (
    <div
      className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
      role="region"
      aria-label="Results"
      aria-live="polite"
    >
      <p className="mb-1 text-sm font-medium text-zinc-500">{primaryLabel}</p>
      <p className="text-2xl font-semibold tabular-nums text-zinc-900 sm:text-3xl">
        {primaryValue}
      </p>
      {secondaryItems && secondaryItems.length > 0 && (
        <div className="mt-3 grid gap-x-8 gap-y-3 border-t border-zinc-200 pt-3 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryItems.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-zinc-500">{item.label}</p>
              <p className="font-medium tabular-nums text-zinc-700">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
