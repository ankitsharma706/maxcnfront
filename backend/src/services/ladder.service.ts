import { calculateGreeks, GreeksCalculationInput } from './greeks.service';
import { env } from '../config/env';
import { Price } from '../models/Price';

export interface LadderStep {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  premium: number;
}

export interface GreeksLadder {
  commodity: string;
  strike: number;
  optionType: 'CALL' | 'PUT';
  ladder: LadderStep[];
}

export const generateGreeksLadder = async (
  commodity: string,
  strike: number,
  iv: number,
  daysToExpiry: number,
  optionType: 'CALL' | 'PUT',
  steps: number = 5,
  tickSize: number = 100
): Promise<GreeksLadder> => {
  // Get latest price to center the ladder
  const latestPriceDoc = await Price.findOne({ commodity })
    .sort({ timestamp: -1 })
    .lean();
    
  if (!latestPriceDoc) {
    throw new Error(`No recent price found for commodity: ${commodity}`);
  }

  const currentPrice = latestPriceDoc.currentPrice;
  const ladder: LadderStep[] = [];

  // Generate grid from -steps to +steps
  for (let i = -steps; i <= steps; i++) {
    const simulatedPrice = currentPrice + (i * tickSize);
    
    const input: GreeksCalculationInput = {
      commodity,
      spotPrice: simulatedPrice,
      strike,
      iv,
      daysToExpiry,
      optionType,
      riskFreeRate: env.RISK_FREE_RATE || 0.07,
    };

    const greeks = calculateGreeks(input);

    ladder.push({
      price: simulatedPrice,
      delta: greeks.delta,
      gamma: greeks.gamma,
      theta: greeks.theta,
      vega: greeks.vega,
      premium: greeks.premium,
    });
  }

  return {
    commodity,
    strike,
    optionType,
    ladder,
  };
};
