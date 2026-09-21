import { Request, Response, NextFunction } from 'express';
import { createAlert, getUserAlerts, deleteAlert } from '../services/alert.service';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

/**
 * Get all alerts for the authenticated user.
 */
export const getAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const alerts = await getUserAlerts(userId);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new alert.
 */
export const addAlert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { commodity, metric, condition, threshold, alertTypes } = req.body;

    const alert = await createAlert({
      userId: new mongoose.Types.ObjectId(userId),
      commodity,
      metric,
      condition,
      threshold,
      alertTypes,
    });

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an alert.
 */
export const removeAlert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const alertId = req.params.id;

    await deleteAlert(alertId, userId);

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
