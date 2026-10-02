"use client";

interface ResetButtonProps {
  onClick: () => void;
  label?: string;
}

export function ResetButton({ onClick, label = "Reset" }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {label}
    </button>
  );
}
