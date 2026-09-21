import { Request, Response, NextFunction } from 'express';
import {
  processChartUpload,
  processOptionChainUpload,
  processCsvUpload,
} from '../services/upload.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * POST /api/upload/chart
 * Upload a TradingView or broker chart screenshot.
 */
export const uploadChart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded. Please provide a chart image.', 400);
    }

    const result = await processChartUpload(req.file, req.user!.id);

    logger.info(`Chart uploaded and processed: ${req.file.originalname}`);

    res.status(200).json({
      success: true,
      message: 'Chart processed successfully',
      data: {
        uploadId: result.upload._id,
        fileName: result.upload.fileName,
        extractedData: result.extractedData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/upload/option-chain
 * Upload an option chain screenshot from any supported broker.
 */
export const uploadOptionChain = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded. Please provide an option chain screenshot.', 400);
    }

    const result = await processOptionChainUpload(req.file, req.user!.id);

    logger.info(`Option chain uploaded and processed: ${req.file.originalname}`);

    res.status(200).json({
      success: true,
      message: 'Option chain processed successfully',
      data: {
        uploadId: result.upload._id,
        fileName: result.upload.fileName,
        extractedData: result.extractedData,
        greeksCalculated: result.greeksCalculated,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/upload/csv
 * Upload a CSV or XLSX file with option data.
 */
export const uploadCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded. Please provide a CSV or XLSX file.', 400);
    }

    const result = await processCsvUpload(req.file, req.user!.id);

    logger.info(`CSV uploaded and processed: ${req.file.originalname}`);

    res.status(200).json({
      success: true,
      message: 'CSV processed successfully',
      data: {
        uploadId: result.upload._id,
        fileName: result.upload.fileName,
        extractedData: result.extractedData,
        greeksCalculated: result.greeksCalculated,
      },
    });
  } catch (error) {
    next(error);
  }
};
