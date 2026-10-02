import type { EngineResult, EngineError } from "@/types/time";

/**
 * Validate that a value is a valid hour component (0-23 for 24h, 0-12 for 12h).
 */
export function validateHour(
  value: unknown,
  is12Hour = false,
): EngineResult<number> {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_TYPE",
        message: `Expected a number, got ${typeof value}`,
      },
    };
  }

  if (!Number.isInteger(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_HOURS",
        message: `Hours must be an integer, got ${value}`,
      },
    };
  }

  const max = is12Hour ? 12 : 23;
  const min = is12Hour ? 1 : 0;

  if (value < min || value > max) {
    return {
      ok: false,
      error: {
        code: "INVALID_HOURS",
        message: `Hours must be between ${min} and ${max}, got ${value}`,
      },
    };
  }

  return { ok: true, value };
}

/**
 * Validate that a value is a valid minute component (0-59).
 */
export function validateMinute(value: unknown): EngineResult<number> {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_TYPE",
        message: `Expected a number, got ${typeof value}`,
      },
    };
  }

  if (!Number.isInteger(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_MINUTES",
        message: `Minutes must be an integer, got ${value}`,
      },
    };
  }

  if (value < 0 || value > 59) {
    return {
      ok: false,
      error: {
        code: "INVALID_MINUTES",
        message: `Minutes must be between 0 and 59, got ${value}`,
      },
    };
  }

  return { ok: true, value };
}

/**
 * Validate that a value is a valid second component (0-59).
 */
export function validateSecond(value: unknown): EngineResult<number> {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_TYPE",
        message: `Expected a number, got ${typeof value}`,
      },
    };
  }

  if (!Number.isInteger(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_SECONDS",
        message: `Seconds must be an integer, got ${value}`,
      },
    };
  }

  if (value < 0 || value > 59) {
    return {
      ok: false,
      error: {
        code: "INVALID_SECONDS",
        message: `Seconds must be between 0 and 59, got ${value}`,
      },
    };
  }

  return { ok: true, value };
}

/**
 * Validate a decimal hours value (non-negative finite number).
 */
export function validateDecimalHours(value: unknown): EngineResult<number> {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_TYPE",
        message: `Expected a finite number, got ${typeof value}`,
      },
    };
  }

  if (value < 0) {
    return {
      ok: false,
      error: {
        code: "NEGATIVE_VALUE",
        message: `Decimal hours must be non-negative, got ${value}`,
      },
    };
  }

  return { ok: true, value };
}

/**
 * Validate a break duration (non-negative integer minutes).
 */
export function validateBreakMinutes(value: unknown): EngineResult<number> {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_TYPE",
        message: `Expected a number, got ${typeof value}`,
      },
    };
  }

  if (!Number.isInteger(value)) {
    return {
      ok: false,
      error: {
        code: "INVALID_BREAK",
        message: `Break duration must be an integer number of minutes, got ${value}`,
      },
    };
  }

  if (value < 0) {
    return {
      ok: false,
      error: {
        code: "NEGATIVE_BREAK",
        message: `Break duration cannot be negative, got ${value}`,
      },
    };
  }

  return { ok: true, value };
}

/**
 * Collect all errors from an array of EngineResults.
 * Returns null if all results are ok.
 */
export function collectErrors<T>(results: EngineResult<T>[]): EngineError[] {
  const errors: EngineError[] = [];
  for (const result of results) {
    if (!result.ok) {
      errors.push(result.error);
    }
  }
  return errors;
}
