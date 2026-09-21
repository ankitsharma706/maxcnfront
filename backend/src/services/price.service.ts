import { Price, IPrice } from '../models/Price';
import { logger } from '../utils/logger';

export interface ManualPriceInput {
  commodity: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  source?: 'manual' | 'ocr' | 'api';
}

/**
 * Store a manually entered price.
 */
export const createManualPrice = async (input: ManualPriceInput): Promise<IPrice> => {
  const price = await Price.create({
    commodity: input.commodity,
    currentPrice: input.price,
    open: input.open,
    high: input.high,
    low: input.low,
    close: input.close,
    source: input.source || 'manual',
    timestamp: new Date(),
  });

  logger.info(`Manual price stored: ${input.commodity} @ ${input.price}`);
  return price;
};

/**
 * Get the latest price for a commodity.
 */
export const getLatestPrice = async (commodity?: string): Promise<any> => {
  if (commodity) {
    const price = await Price.findOne({ commodity })
      .sort({ timestamp: -1 })
      .lean();

    if (!price) {
      throw new Error(`No price found for commodity: ${commodity}`);
    }

    return price;
  }

  // Get latest price for each commodity
  const latestPrices = await Price.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$commodity',
        latestDoc: { $first: '$$ROOT' },
      },
    },
    { $replaceRoot: { newRoot: '$latestDoc' } },
    { $sort: { commodity: 1 } },
  ]);

  return latestPrices;
};

/**
 * Get price history for a commodity.
 */
export const getPriceHistory = async (
  commodity: string,
  limit: number = 100,
  page: number = 1
): Promise<{
  prices: any[];
  total: number;
  page: number;
  pages: number;
}> => {
  const skip = (page - 1) * limit;

  const [prices, total] = await Promise.all([
    Price.find({ commodity })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Price.countDocuments({ commodity }),
  ]);

  return {
    prices,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};
