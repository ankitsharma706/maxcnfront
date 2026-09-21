import { Request, Response, NextFunction } from 'express';
import { createPortfolio, addPortfolioItem, getPortfolio, getUserPortfolios } from '../services/portfolio.service';
import { AppError } from '../middleware/errorHandler';

export const createNewPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { name } = req.body;
    const portfolio = await createPortfolio(userId, name || 'New Portfolio');

    res.status(201).json({ success: true, data: portfolio });
  } catch (error) {
    next(error);
  }
};

export const addItemToPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const portfolioId = req.params.id;
    const item = req.body;

    const portfolio = await addPortfolioItem(portfolioId, userId, item);
    if (!portfolio) throw new AppError('Portfolio not found', 404);

    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    next(error);
  }
};

export const fetchPortfolioAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const portfolioId = req.params.id;
    const analysis = await getPortfolio(portfolioId, userId);
    if (!analysis) throw new AppError('Portfolio not found', 404);

    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};

export const listUserPortfolios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const portfolios = await getUserPortfolios(userId);

    res.status(200).json({ success: true, data: portfolios });
  } catch (error) {
    next(error);
  }
};
