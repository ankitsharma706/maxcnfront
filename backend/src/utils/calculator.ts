/**
 * Cumulative Normal Distribution Function (CND)
 * Uses the Abramowitz and Stegun approximation (error < 7.5e-8).
 */
export const cumulativeNormalDistribution = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);

  return 0.5 * (1.0 + sign * y);
};

/**
 * Standard Normal Probability Density Function (PDF)
 */
export const standardNormalPDF = (x: number): number => {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
};

/**
 * Convert days to year fraction
 * Uses 365-day year convention
 */
export const daysToYears = (days: number): number => {
  return days / 365;
};

/**
 * Round to specified decimal places (default 6)
 */
export const roundTo = (value: number, decimals: number = 6): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Ensure IV is in decimal form (e.g., 28 → 0.28)
 */
export const normalizeIV = (iv: number): number => {
  if (iv > 1) {
    return iv / 100;
  }
  return iv;
};

/**
 * Validate that a number is finite and not NaN
 */
export const isValidNumber = (n: number): boolean => {
  return Number.isFinite(n) && !Number.isNaN(n);
};
