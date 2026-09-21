import { Portfolio, IPortfolioItem } from '../models/Portfolio';
import { calculateGreeks, GreeksCalculationInput } from './greeks.service';
import { Price } from '../models/Price';
import { env } from '../config/env';

export const createPortfolio = async (userId: string, name: string) => {
  const portfolio = new Portfolio({ userId, name, items: [] });
  return await portfolio.save();
};

export const addPortfolioItem = async (portfolioId: string, userId: string, item: IPortfolioItem) => {
  return await Portfolio.findOneAndUpdate(
    { _id: portfolioId, userId },
    { $push: { items: item } },
    { new: true }
  );
};

export const getPortfolio = async (portfolioId: string, userId: string) => {
  const portfolio = await Portfolio.findOne({ _id: portfolioId, userId }).lean();
  if (!portfolio) return null;

  let netDelta = 0;
  let netGamma = 0;
  let netTheta = 0;
  let netVega = 0;
  let netRho = 0;
  let totalPnL = 0;

  const analyzedItems = [];

  for (const item of portfolio.items) {
    // Get latest price for the commodity
    const latestPrice = await Price.findOne({ commodity: item.commodity }).sort({ timestamp: -1 }).lean();
    const spotPrice = latestPrice ? latestPrice.currentPrice : item.strike; // Fallback to strike if no price found

    const input: GreeksCalculationInput = {
      commodity: item.commodity,
      spotPrice,
      strike: item.strike,
      iv: 25, // Assuming fixed IV for now, in a real system this comes from IV engine
      daysToExpiry: 15, // Assuming 15 DTE
      optionType: item.optionType as 'CALL' | 'PUT',
      riskFreeRate: env.RISK_FREE_RATE || 0.07
    };

    const greeks = calculateGreeks(input);

    const positionDelta = greeks.delta * item.lots;
    const positionGamma = greeks.gamma * item.lots;
    const positionTheta = greeks.theta * item.lots;
    const positionVega = greeks.vega * item.lots;
    const positionRho = greeks.rho * item.lots;

    const currentPremium = greeks.premium;
    const pnl = (currentPremium - item.premium) * item.lots;

    netDelta += positionDelta;
    netGamma += positionGamma;
    netTheta += positionTheta;
    netVega += positionVega;
    netRho += positionRho;
    totalPnL += pnl;

    analyzedItems.push({
      ...item,
      currentSpot: spotPrice,
      currentPremium,
      pnl,
      greeks: {
        delta: positionDelta,
        gamma: positionGamma,
        theta: positionTheta,
        vega: positionVega,
        rho: positionRho
      }
    });
  }

  return {
    portfolioId: portfolio._id,
    name: portfolio.name,
    netDelta,
    netGamma,
    netTheta,
    netVega,
    netRho,
    totalPnL,
    items: analyzedItems
  };
};

export const getUserPortfolios = async (userId: string) => {
  return await Portfolio.find({ userId }).select('_id name createdAt').lean();
};
