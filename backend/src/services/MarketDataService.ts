import { MarketData } from '../models/MarketData';
import { broadcastMarketData } from '../socket';

export class MarketDataService {
  private static instance: MarketDataService;
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  public startSimulation(commodity: string, initialPrice: number) {
    if (this.intervalIds.has(commodity)) return;

    let currentPrice = initialPrice;
    
    const intervalId = setInterval(async () => {
      // Simulate price movement
      const change = (Math.random() - 0.5) * (initialPrice * 0.001); // 0.1% max movement
      currentPrice += change;
      
      const newMarketData = new MarketData({
        commodity,
        spotPrice: currentPrice,
        impliedVolatility: 15 + Math.random() * 5, // 15-20%
        totalCallOI: Math.floor(Math.random() * 100000),
        totalPutOI: Math.floor(Math.random() * 100000),
        timestamp: new Date()
      });

      await newMarketData.save();
      
      broadcastMarketData(commodity, newMarketData);
      
    }, 5000); // Every 5 seconds

    this.intervalIds.set(commodity, intervalId);
  }

  public stopSimulation(commodity: string) {
    const id = this.intervalIds.get(commodity);
    if (id) {
      clearInterval(id);
      this.intervalIds.delete(commodity);
    }
  }
}
