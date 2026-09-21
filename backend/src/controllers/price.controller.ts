import { Request, Response, NextFunction } from 'express';
import * as priceService from '../services/price.service';
import { processChartUpload } from '../services/upload.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * POST /api/price/manual
 * Manually enter a commodity price.
 */
export const manualEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commodity, price, open, high, low, close, source } = req.body;

    const priceDoc = await priceService.createManualPrice({
      commodity: commodity || 'Gold Mini',
      price,
      open,
      high,
      low,
      close,
      source: source || 'manual',
    });

    logger.info(`Manual price entry: ${commodity || 'Gold Mini'} @ ${price}`);

    res.status(201).json({
      success: true,
      message: 'Price stored successfully',
      data: priceDoc,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/price/upload-chart
 * Upload a chart screenshot to extract price.
 */
export const uploadChartPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded. Please provide a chart image.', 400);
    }

    const result = await processChartUpload(req.file, req.user!.id);

    res.status(200).json({
      success: true,
      message: 'Chart processed and price extracted',
      data: result.extractedData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/price/latest
 * Get the latest price for a commodity (or all commodities).
 */
export const getLatest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const prices = await priceService.getLatestPrice(commodity);

    res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/price/history
 * Get price history for a commodity.
 */
export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string;
    if (!commodity) {
      throw new AppError('Commodity query parameter is required', 400);
    }

    const limit = parseInt(req.query.limit as string) || 100;
    const page = parseInt(req.query.page as string) || 1;

    const result = await priceService.getPriceHistory(commodity, limit, page);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
