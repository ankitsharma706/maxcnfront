import { calculateAllGreeks, BlackScholesInput, GreeksResult } from './blackScholes.service';
import { env } from '../config/env';
import { roundTo } from '../utils/calculator';

export interface GreeksCalculationInput {
  commodity: string;
  spotPrice: number;
  strike: number;
  iv: number;
  daysToExpiry: number;
  optionType: 'CALL' | 'PUT';
  riskFreeRate?: number;
  lots?: number;
}

export interface GreeksCalculationResult extends GreeksResult {
  commodity: string;
  spotPrice: number;
  strike: number;
  iv: number;
  daysToExpiry: number;
  optionType: 'CALL' | 'PUT';
  riskFreeRate: number;
  lots: number;
  notionalValue: number;
}

export interface ScenarioResult {
  priceMove: number;
  newSpotPrice: number;
  greeks: GreeksResult;
  pnl: number;
  pnlPercent: number;
}

export interface ScenarioAnalysisResult {
  baseCase: GreeksCalculationResult;
  scenarios: ScenarioResult[];
}

/**
 * Calculate Greeks for a single option position.
 */
export const calculateGreeks = (input: GreeksCalculationInput): GreeksCalculationResult => {
  const riskFreeRate = input.riskFreeRate ?? env.RISK_FREE_RATE;
  const lots = input.lots ?? 1;

  const bsInput: BlackScholesInput = {
    spotPrice: input.spotPrice,
    strike: input.strike,
    daysToExpiry: input.daysToExpiry,
    riskFreeRate,
    iv: input.iv,
    optionType: input.optionType,
  };

  const greeks = calculateAllGreeks(bsInput);

  return {
    ...greeks,
    commodity: input.commodity,
    spotPrice: input.spotPrice,
    strike: input.strike,
    iv: input.iv,
    daysToExpiry: input.daysToExpiry,
    optionType: input.optionType,
    riskFreeRate,
    lots,
    notionalValue: roundTo(greeks.premium * lots, 2),
  };
};

/**
 * Run scenario analysis: recalculate greeks for each price move.
 */
export const calculateScenario = (
  input: GreeksCalculationInput,
  priceMoves: number[]
): ScenarioAnalysisResult => {
  // Calculate base case
  const baseCase = calculateGreeks(input);

  // Calculate each scenario
  const scenarios: ScenarioResult[] = priceMoves.map((move) => {
    const newSpotPrice = input.spotPrice + move;

    // Skip if new spot price is zero or negative
    if (newSpotPrice <= 0) {
      return {
        priceMove: move,
        newSpotPrice,
        greeks: {
          delta: 0,
          gamma: 0,
          theta: 0,
          vega: 0,
          rho: 0,
          premium: 0,
          d1: 0,
          d2: 0,
        },
        pnl: -baseCase.premium * (input.lots ?? 1),
        pnlPercent: -100,
      };
    }

    const scenarioInput: BlackScholesInput = {
      spotPrice: newSpotPrice,
      strike: input.strike,
      daysToExpiry: input.daysToExpiry,
      riskFreeRate: input.riskFreeRate ?? env.RISK_FREE_RATE,
      iv: input.iv,
      optionType: input.optionType,
    };

    const greeks = calculateAllGreeks(scenarioInput);
    const lots = input.lots ?? 1;
    const pnl = roundTo((greeks.premium - baseCase.premium) * lots, 2);
    const pnlPercent = baseCase.premium > 0
      ? roundTo((pnl / (baseCase.premium * lots)) * 100, 2)
      : 0;

    return {
      priceMove: move,
      newSpotPrice,
      greeks,
      pnl,
      pnlPercent,
    };
  });

  return {
    baseCase,
    scenarios,
  };
};

/**
 * Default scenario price moves for quick analysis.
 */
export const DEFAULT_PRICE_MOVES = [
  100, 500, 1000, 1500, 2000,
  -100, -500, -1000, -1500, -2000,
];
