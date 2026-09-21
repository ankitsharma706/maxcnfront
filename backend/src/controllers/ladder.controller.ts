import { Request, Response, NextFunction } from 'express';
import { generateGreeksLadder } from '../services/ladder.service';
import { AppError } from '../middleware/errorHandler';

/**
 * Get Greeks Ladder for a commodity.
 * Query params: commodity (required), strike (required), iv (required), daysToExpiry (required), optionType (required)
 */
export const getLadder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { commodity, strike, iv, daysToExpiry, optionType, steps, tickSize } = req.query;

    if (!commodity || !strike || !iv || !daysToExpiry || !optionType) {
      throw new AppError('Missing required query parameters (commodity, strike, iv, daysToExpiry, optionType)', 400);
    }

    const result = await generateGreeksLadder(
      commodity as string,
      parseFloat(strike as string),
      parseFloat(iv as string),
      parseFloat(daysToExpiry as string),
      (optionType as string).toUpperCase() as 'CALL' | 'PUT',
      steps ? parseInt(steps as string) : 5,
      tickSize ? parseFloat(tickSize as string) : 100
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
