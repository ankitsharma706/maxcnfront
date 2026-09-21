import { getGammaExposure, getVegaExposure, getMaxPain, getPCR, getDeltaExposure } from './analytics.service';
import { Price } from '../models/Price';

export interface Insight {
  category: 'Gamma' | 'Vega' | 'Max Pain' | 'PCR' | 'Trend';
  title: string;
  description: string;
  signal: 'Bullish' | 'Bearish' | 'Neutral';
  value: string;
}

/**
 * Generate automated AI-style insights based on current market Greeks and OI.
 */
export const generateInsights = async (commodity: string): Promise<Insight[]> => {
  const insights: Insight[] = [];

  // Fetch all required data points
  const [gammaData, vegaData, maxPainData, pcrData, latestPriceDoc] = await Promise.all([
    getGammaExposure(commodity),
    getVegaExposure(commodity),
    getMaxPain(commodity),
    getPCR(commodity),
    Price.findOne({ commodity }).sort({ timestamp: -1 }).lean()
  ]);

  const spotPrice = latestPriceDoc?.currentPrice || 0;

  // 1. PCR Insight
  const pcrSignal = pcrData.pcrByOI > 1.2 ? 'Bearish' : (pcrData.pcrByOI < 0.8 ? 'Bullish' : 'Neutral');
  insights.push({
    category: 'PCR',
    title: 'Put-Call Ratio Sentiment',
    description: `PCR by Open Interest is currently ${pcrData.pcrByOI}. This indicates a ${pcrSignal.toLowerCase()} market sentiment among option writers.`,
    signal: pcrSignal,
    value: pcrData.pcrByOI.toString()
  });

  // 2. Max Pain Insight
  if (spotPrice > 0 && maxPainData.maxPain > 0) {
    const distance = spotPrice - maxPainData.maxPain;
    const isAbove = distance > 0;
    const mpSignal = isAbove ? 'Bearish' : 'Bullish'; // Price tends to gravitate toward Max Pain
    
    insights.push({
      category: 'Max Pain',
      title: 'Max Pain Magnet',
      description: `Spot price (${spotPrice}) is ${Math.abs(distance)} points ${isAbove ? 'above' : 'below'} the Max Pain strike of ${maxPainData.maxPain}. Expect price gravity towards this strike near expiry.`,
      signal: mpSignal,
      value: maxPainData.maxPain.toString()
    });
  }

  // 3. Gamma Exposure Insight
  const netGamma = gammaData.gex;
  insights.push({
    category: 'Gamma',
    title: 'Market Maker Gamma Exposure',
    description: `Net Gamma Exposure (GEX) is ${netGamma > 0 ? 'positive' : 'negative'}. ${netGamma > 0 ? 'Expect lower volatility as dealers hedge against market moves.' : 'Expect higher volatility as dealers sell into weakness and buy into strength.'}`,
    signal: netGamma > 0 ? 'Neutral' : 'Bearish',
    value: netGamma.toFixed(2)
  });

  return insights;
};
