/**
 * Check if a value is a valid number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Check if a value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

/**
 * Check if a value is within a range
 */
export function isInRange(
  value: number,
  min: number,
  max: number,
): boolean {
  return value >= min && value <= max;
}
