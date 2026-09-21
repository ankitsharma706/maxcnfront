import { Request, Response, NextFunction } from 'express';
import { calculateGreeks, calculateScenario, DEFAULT_PRICE_MOVES } from '../services/greeks.service';
import { GreekRepository } from '../repositories/greek.repository';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const greekRepo = new GreekRepository();

/**
 * POST /api/greeks/calculate
 * Calculate Greeks for a single option position.
 */
export const calculate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      commodity,
      spotPrice,
      strike,
      iv,
      daysToExpiry,
      optionType,
      riskFreeRate,
      lots,
    } = req.body;

    const result = calculateGreeks({
      commodity,
      spotPrice,
      strike,
      iv,
      daysToExpiry,
      optionType,
      riskFreeRate,
      lots,
    });

    // Store the calculation
    const expiry = new Date(Date.now() + daysToExpiry * 24 * 60 * 60 * 1000);
    const saved = await greekRepo.create({
      commodity,
      strike,
      expiry,
      optionType,
      spotPrice,
      iv,
      riskFreeRate: riskFreeRate || env.RISK_FREE_RATE,
      daysToExpiry,
      delta: result.delta,
      gamma: result.gamma,
      theta: result.theta,
      vega: result.vega,
      rho: result.rho,
      premium: result.premium,
      lots: lots || 1,
      userId: req.user?.id as any,
    });

    logger.info(`Greeks calculated for ${commodity} ${optionType} ${strike}`);

    res.status(200).json({
      success: true,
      message: 'Greeks calculated successfully',
      data: {
        id: saved._id,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/greeks/scenario
 * Run scenario analysis with custom price moves.
 */
export const scenario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      commodity,
      spotPrice,
      strike,
      iv,
      daysToExpiry,
      optionType,
      riskFreeRate,
      priceMove,
      lots,
    } = req.body;

    const priceMoves = priceMove || DEFAULT_PRICE_MOVES;

    const result = calculateScenario(
      {
        commodity,
        spotPrice,
        strike,
        iv,
        daysToExpiry,
        optionType,
        riskFreeRate,
        lots,
      },
      priceMoves
    );

    res.status(200).json({
      success: true,
      message: 'Scenario analysis completed',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/greeks/history
 * Get Greeks calculation history for the authenticated user.
 */
export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await greekRepo.getHistory(req.user!.id, limit, page);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/greeks/:id
 * Get a specific Greek calculation by ID.
 */
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const greek = await greekRepo.findById(id);

    if (!greek) {
      throw new AppError('Greek calculation not found', 404);
    }

    res.status(200).json({
      success: true,
      data: greek,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/greeks/:id
 * Delete a Greek calculation by ID.
 */
export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await greekRepo.deleteById(id);

    if (!deleted) {
      throw new AppError('Greek calculation not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Greek calculation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
