import { Request, Response, NextFunction } from 'express';
import { generateInsights } from '../services/insights.service';
import { AppError } from '../middleware/errorHandler';

/**
 * Get AI Insights for a commodity.
 * Query params: commodity (required)
 */
export const getInsights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commodity } = req.query;

    if (!commodity) {
      throw new AppError('Commodity query parameter is required', 400);
    }

    const insights = await generateInsights(commodity as string);

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};
