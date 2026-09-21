import { Greek, IGreek } from '../models/Greek';
import { Analytics } from '../models/Analytics';
import { GreeksLadder, IGreeksLadderRow } from '../models/GreeksLadder';

export class AnalyticsEngine {
  
  public static async calculateMaxPain(commodity: string): Promise<number> {
    // Simplified Max Pain calculation logic
    // In reality, this iterates strikes to find min cash value
    const greeks = await Greek.find({ commodity, optionType: 'CALL' }).sort({ strike: 1 });
    if (!greeks.length) return 0;
    
    // Stub implementation returning a median strike for max pain
    const middleIndex = Math.floor(greeks.length / 2);
    return greeks[middleIndex]?.strike || 0;
  }

  public static async calculatePCR(commodity: string): Promise<number> {
    const calls = await Greek.find({ commodity, optionType: 'CALL' });
    const puts = await Greek.find({ commodity, optionType: 'PUT' });
    
    const totalCallOI = calls.reduce((acc, c) => acc + (c.lots || 0), 0);
    const totalPutOI = puts.reduce((acc, p) => acc + (p.lots || 0), 0);
    
    if (totalCallOI === 0) return 1;
    return Number((totalPutOI / totalCallOI).toFixed(4));
  }

  public static async generateGreeksLadder(commodity: string, spotPrice: number, step: number = 100) {
    const strikes = [];
    for(let i = -5; i <= 5; i++) {
       strikes.push(spotPrice + (i * step));
    }
    
    const ladderRows: IGreeksLadderRow[] = strikes.map(strike => ({
      strike,
      price: spotPrice, // In reality, fetch actual option premium
      delta: Math.random() * (strike < spotPrice ? 0.9 : 0.1),
      gamma: Math.random() * 0.05,
      theta: -(Math.random() * 10),
      vega: Math.random() * 5
    }));
    
    const ladder = new GreeksLadder({
      commodity,
      currentSpotPrice: spotPrice,
      ladder: ladderRows
    });
    
    await ladder.save();
    return ladder;
  }
}
