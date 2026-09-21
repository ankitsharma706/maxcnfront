import { Insight } from '../models/Insight';
import { MarketData } from '../models/MarketData';

export class InsightEngine {
  public static async generateInsights(commodity: string): Promise<void> {
    const marketData = await MarketData.findOne({ commodity }).sort({ timestamp: -1 });
    if (!marketData) return;

    // Example AI Insight Generation
    
    // 1. PCR Signal
    const pcr = marketData.totalCallOI === 0 ? 1 : marketData.totalPutOI / marketData.totalCallOI;
    let pcrSignal = 'Neutral';
    let pcrExpl = 'Market sentiment is balanced.';
    if (pcr > 1.2) {
      pcrSignal = 'Bullish';
      pcrExpl = 'High put writing indicates strong support.';
    } else if (pcr < 0.8) {
      pcrSignal = 'Bearish';
      pcrExpl = 'High call writing indicates strong resistance.';
    }

    const pcrInsight = new Insight({
      commodity,
      type: 'PCR Signal',
      value: pcrSignal,
      explanation: pcrExpl
    });
    
    await pcrInsight.save();
    
    // In a real application, you'd generate ATM/ITM/OTM, Max Pain, Highest Gamma here as well.
  }
}
