/**
 * Black-Scholes Pricing Engine
 *
 * Production-grade implementation for European options on commodities.
 * Supports both CALL and PUT options with 6-decimal precision.
 *
 * Model Parameters:
 *   S = Spot (current) price of the underlying
 *   K = Strike price
 *   T = Time to expiration in years
 *   r = Risk-free interest rate (annualized, decimal form)
 *   σ = Implied volatility (annualized, decimal form)
 */

import {
  cumulativeNormalDistribution,
  standardNormalPDF,
  roundTo,
  normalizeIV,
  daysToYears,
} from '../utils/calculator';

export type OptionType = 'CALL' | 'PUT';

export interface BlackScholesInput {
  spotPrice: number;     // S
  strike: number;        // K
  daysToExpiry: number;  // converted to T internally
  riskFreeRate: number;  // r (decimal, e.g., 0.07)
  iv: number;            // σ (can be percentage or decimal; auto-normalized)
  optionType: OptionType;
}

export interface GreeksResult {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  premium: number;
  d1: number;
  d2: number;
}

/**
 * Calculate d1 in the Black-Scholes formula.
 *
 * d1 = [ln(S/K) + (r + σ²/2) × T] / (σ × √T)
 */
export const calculateD1 = (
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number => {
  if (T <= 0 || sigma <= 0) return 0;

  const numerator = Math.log(S / K) + (r + (sigma * sigma) / 2) * T;
  const denominator = sigma * Math.sqrt(T);

  return numerator / denominator;
};

/**
 * Calculate d2 in the Black-Scholes formula.
 *
 * d2 = d1 - σ × √T
 */
export const calculateD2 = (d1: number, sigma: number, T: number): number => {
  if (T <= 0 || sigma <= 0) return 0;
  return d1 - sigma * Math.sqrt(T);
};

/**
 * Calculate Delta.
 *
 * CALL: N(d1)
 * PUT:  N(d1) - 1
 *
 * Measures the rate of change of option price with respect to the underlying price.
 */
export const calculateDelta = (d1: number, optionType: OptionType): number => {
  const Nd1 = cumulativeNormalDistribution(d1);
  return optionType === 'CALL' ? roundTo(Nd1) : roundTo(Nd1 - 1);
};

/**
 * Calculate Gamma.
 *
 * Gamma = N'(d1) / (S × σ × √T)
 *
 * Same for both CALL and PUT. Measures the rate of change of delta.
 */
export const calculateGamma = (
  d1: number,
  S: number,
  sigma: number,
  T: number
): number => {
  if (T <= 0 || sigma <= 0 || S <= 0) return 0;

  const Npd1 = standardNormalPDF(d1);
  return roundTo(Npd1 / (S * sigma * Math.sqrt(T)));
};

/**
 * Calculate Theta (per day).
 *
 * CALL: -(S × N'(d1) × σ) / (2 × √T) - r × K × e^(-rT) × N(d2)
 * PUT:  -(S × N'(d1) × σ) / (2 × √T) + r × K × e^(-rT) × N(-d2)
 *
 * Divided by 365 to convert to daily theta.
 */
export const calculateTheta = (
  d1: number,
  d2: number,
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: OptionType
): number => {
  if (T <= 0 || sigma <= 0) return 0;

  const Npd1 = standardNormalPDF(d1);
  const sqrtT = Math.sqrt(T);
  const ert = Math.exp(-r * T);

  const term1 = -(S * Npd1 * sigma) / (2 * sqrtT);

  let theta: number;

  if (optionType === 'CALL') {
    const Nd2 = cumulativeNormalDistribution(d2);
    theta = term1 - r * K * ert * Nd2;
  } else {
    const Nmd2 = cumulativeNormalDistribution(-d2);
    theta = term1 + r * K * ert * Nmd2;
  }

  // Convert annual theta to daily theta
  return roundTo(theta / 365);
};

/**
 * Calculate Vega.
 *
 * Vega = S × √T × N'(d1)
 *
 * Same for both CALL and PUT.
 * Returned per 1% change in IV (divided by 100).
 */
export const calculateVega = (
  d1: number,
  S: number,
  T: number
): number => {
  if (T <= 0) return 0;

  const Npd1 = standardNormalPDF(d1);
  const vega = S * Math.sqrt(T) * Npd1;

  // Per 1% IV change
  return roundTo(vega / 100);
};

/**
 * Calculate Rho.
 *
 * CALL: K × T × e^(-rT) × N(d2)
 * PUT:  -K × T × e^(-rT) × N(-d2)
 *
 * Returned per 1% change in interest rate (divided by 100).
 */
export const calculateRho = (
  d2: number,
  K: number,
  T: number,
  r: number,
  optionType: OptionType
): number => {
  if (T <= 0) return 0;

  const ert = Math.exp(-r * T);

  let rho: number;

  if (optionType === 'CALL') {
    const Nd2 = cumulativeNormalDistribution(d2);
    rho = K * T * ert * Nd2;
  } else {
    const Nmd2 = cumulativeNormalDistribution(-d2);
    rho = -K * T * ert * Nmd2;
  }

  // Per 1% rate change
  return roundTo(rho / 100);
};

/**
 * Calculate option premium (theoretical price).
 *
 * CALL: S × N(d1) - K × e^(-rT) × N(d2)
 * PUT:  K × e^(-rT) × N(-d2) - S × N(-d1)
 */
export const calculatePremium = (
  d1: number,
  d2: number,
  S: number,
  K: number,
  T: number,
  r: number,
  optionType: OptionType
): number => {
  if (T <= 0) {
    // At expiration, option is worth its intrinsic value
    if (optionType === 'CALL') {
      return roundTo(Math.max(S - K, 0));
    } else {
      return roundTo(Math.max(K - S, 0));
    }
  }

  const ert = Math.exp(-r * T);

  let premium: number;

  if (optionType === 'CALL') {
    const Nd1 = cumulativeNormalDistribution(d1);
    const Nd2 = cumulativeNormalDistribution(d2);
    premium = S * Nd1 - K * ert * Nd2;
  } else {
    const Nmd1 = cumulativeNormalDistribution(-d1);
    const Nmd2 = cumulativeNormalDistribution(-d2);
    premium = K * ert * Nmd2 - S * Nmd1;
  }

  return roundTo(Math.max(premium, 0));
};

/**
 * Calculate all Greeks for a given set of inputs.
 * Main entry point for the Black-Scholes engine.
 */
export const calculateAllGreeks = (input: BlackScholesInput): GreeksResult => {
  const S = input.spotPrice;
  const K = input.strike;
  const T = daysToYears(input.daysToExpiry);
  const r = input.riskFreeRate;
  const sigma = normalizeIV(input.iv);
  const optionType = input.optionType;

  const d1 = calculateD1(S, K, T, r, sigma);
  const d2 = calculateD2(d1, sigma, T);

  return {
    delta: calculateDelta(d1, optionType),
    gamma: calculateGamma(d1, S, sigma, T),
    theta: calculateTheta(d1, d2, S, K, T, r, sigma, optionType),
    vega: calculateVega(d1, S, T),
    rho: calculateRho(d2, K, T, r, optionType),
    premium: calculatePremium(d1, d2, S, K, T, r, optionType),
    d1: roundTo(d1),
    d2: roundTo(d2),
  };
};
