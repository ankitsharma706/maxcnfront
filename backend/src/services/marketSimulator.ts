import { getIO } from '../socket';
import { logger } from '../utils/logger';
import { calculateGreeks } from './greeks.service';
import { env } from '../config/env';

// List of supported commodities with realistic base prices
const COMMODITIES = [
  { name: 'MCX Gold', basePrice: 70000, volatility: 0.002, tickSize: 1 },
  { name: 'MCX Gold Mini', basePrice: 70000, volatility: 0.002, tickSize: 1 },
  { name: 'MCX Silver', basePrice: 85000, volatility: 0.005, tickSize: 1 },
  { name: 'MCX Crude Oil', basePrice: 6500, volatility: 0.015, tickSize: 1 },
  { name: 'MCX Natural Gas', basePrice: 150, volatility: 0.02, tickSize: 0.1 },
  { name: 'MCX Copper', basePrice: 750, volatility: 0.008, tickSize: 0.05 },
];

const currentPrices = new Map<string, number>();

// Initialize base prices
COMMODITIES.forEach(c => currentPrices.set(c.name, c.basePrice));

let simulationInterval: NodeJS.Timeout | null = null;

/**
 * Start the mock market data simulator.
 * Broadcasts updated prices and recalculated Greeks over WebSockets.
 */
export const startMarketSimulator = () => {
  if (simulationInterval) return;

  logger.info('Starting Mock Market Data Simulator...');
  
  // Update every 2 seconds
  simulationInterval = setInterval(() => {
    try {
      const io = getIO();
      
      COMMODITIES.forEach(commodity => {
        const oldPrice = currentPrices.get(commodity.name)!;
        
        // Random walk: Normal distribution approximation
        const rand = (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
        const change = oldPrice * commodity.volatility * rand;
        
        // Round to tick size
        const tickMultiplier = 1 / commodity.tickSize;
        let newPrice = Math.round((oldPrice + change) * tickMultiplier) / tickMultiplier;
        
        currentPrices.set(commodity.name, newPrice);

        // 1. Emit Price Update
        io.emit('priceUpdate', {
          commodity: commodity.name,
          price: newPrice,
          timestamp: new Date().toISOString(),
          change: newPrice - oldPrice
        });

        // 2. Generate ATM Strike Greeks Update (Example)
        const atmStrike = Math.round(newPrice / 100) * 100; // Simplified ATM calculation
        
        const greeksInput = {
          commodity: commodity.name,
          spotPrice: newPrice,
          strike: atmStrike,
          iv: 25, // Mock IV
          daysToExpiry: 15,
          optionType: 'CALL' as const,
          riskFreeRate: env.RISK_FREE_RATE || 0.07
        };

        const greeks = calculateGreeks(greeksInput);

        io.emit('greeksUpdate', {
          ...greeks,
          timestamp: new Date().toISOString(),
        });
      });
      
    } catch (error) {
      logger.error('Error in market simulator:', error);
    }
  }, 2000); // 2 seconds tick
};

export const stopMarketSimulator = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    logger.info('Stopped Mock Market Data Simulator.');
  }
};
