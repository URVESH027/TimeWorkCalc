"use client";

import { useId } from "react";

interface BreakInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
}

export function BreakInput({
  label = "Break (min)",
  value,
  onChange,
  placeholder = "0",
  error,
  id: externalId,
}: BreakInputProps) {
  const autoId = useId();
  const inputId = externalId ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-zinc-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          error ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-zinc-300"
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
