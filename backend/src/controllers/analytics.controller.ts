import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';
import { logger } from '../utils/logger';

/**
 * GET /api/analytics/delta
 * Get delta exposure analytics.
 */
export const getDelta = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const data = await analyticsService.getDeltaExposure(commodity);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/gamma
 * Get gamma exposure (GEX) analytics.
 */
export const getGamma = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const data = await analyticsService.getGammaExposure(commodity);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/theta
 * Get theta decay analytics.
 */
export const getTheta = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const data = await analyticsService.getThetaDecay(commodity);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/vega
 * Get vega exposure analytics.
 */
export const getVega = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const data = await analyticsService.getVegaExposure(commodity);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/iv
 * Get IV analysis and skew data.
 */
export const getIV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const data = await analyticsService.getIVAnalysis(commodity);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/pcr
 * Get Put-Call Ratio analytics.
 */
export const getPCR = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const data = await analyticsService.getPCR(commodity);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/maxpain
 * Get Max Pain analysis.
 */
export const getMaxPain = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const data = await analyticsService.getMaxPain(commodity);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
