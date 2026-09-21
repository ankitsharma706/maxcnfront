import { Upload, IUpload } from '../models/Upload';
import { Price } from '../models/Price';
import { extractChartData, extractOptionChainData, OcrChartResult, OcrOptionChainResult } from './ocr.service';
import { calculateGreeks, GreeksCalculationInput } from './greeks.service';
import { GreekRepository } from '../repositories/greek.repository';
import { UploadRepository } from '../repositories/upload.repository';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

const greekRepo = new GreekRepository();
const uploadRepo = new UploadRepository();

export interface UploadResult {
  upload: IUpload;
  extractedData: any;
  greeksCalculated?: boolean;
}

/**
 * Process a chart screenshot upload.
 * Flow: Upload → OCR → Extract Price → Store Price → Return
 */
export const processChartUpload = async (
  file: Express.Multer.File,
  userId: string
): Promise<UploadResult> => {
  // Create upload record
  const upload = await uploadRepo.create({
    fileName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype,
    uploadType: 'chart',
    uploadedBy: userId,
  });

  try {
    // Run OCR
    const chartData = await extractChartData(file.path);

    // Store price if extracted
    if (chartData.currentPrice) {
      await Price.create({
        commodity: chartData.commodity || 'Unknown',
        currentPrice: chartData.currentPrice,
        open: chartData.open,
        high: chartData.high,
        low: chartData.low,
        close: chartData.close,
        source: 'ocr',
        timestamp: new Date(),
      });
    }

    // Mark as processed
    await uploadRepo.markProcessed(upload._id.toString(), chartData as any);

    return {
      upload,
      extractedData: chartData,
    };
  } catch (error) {
    await uploadRepo.markError(upload._id.toString(), (error as Error).message);
    throw error;
  }
};

/**
 * Process an option chain screenshot upload.
 * Flow: Upload → OCR → Extract Chain → Calculate Greeks → Store → Return
 */
export const processOptionChainUpload = async (
  file: Express.Multer.File,
  userId: string
): Promise<UploadResult> => {
  const upload = await uploadRepo.create({
    fileName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype,
    uploadType: 'option-chain',
    uploadedBy: userId,
  });

  try {
    // Run OCR
    const chainData = await extractOptionChainData(file.path);

    // Calculate Greeks for each strike
    let greeksCalculated = false;

    if (chainData.strikes.length > 0 && chainData.commodity) {
      // Get latest price for spot reference
      const latestPrice = await Price.findOne({ commodity: chainData.commodity })
        .sort({ timestamp: -1 })
        .lean();

      if (latestPrice) {
        for (const strike of chainData.strikes) {
          // Calculate for call side if data exists
          if (strike.callSide.iv && strike.callSide.iv > 0) {
            const callInput: GreeksCalculationInput = {
              commodity: chainData.commodity,
              spotPrice: latestPrice.currentPrice,
              strike: strike.strike,
              iv: strike.callSide.iv,
              daysToExpiry: 30, // Default; should be calculated from expiry
              optionType: 'CALL',
              riskFreeRate: env.RISK_FREE_RATE,
            };

            const callGreeks = calculateGreeks(callInput);
            await greekRepo.create({
              ...callInput,
              ...callGreeks,
              expiry: chainData.expiry ? new Date(chainData.expiry) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              userId: userId as any,
            });
          }

          // Calculate for put side if data exists
          if (strike.putSide.iv && strike.putSide.iv > 0) {
            const putInput: GreeksCalculationInput = {
              commodity: chainData.commodity,
              spotPrice: latestPrice.currentPrice,
              strike: strike.strike,
              iv: strike.putSide.iv,
              daysToExpiry: 30,
              optionType: 'PUT',
              riskFreeRate: env.RISK_FREE_RATE,
            };

            const putGreeks = calculateGreeks(putInput);
            await greekRepo.create({
              ...putInput,
              ...putGreeks,
              expiry: chainData.expiry ? new Date(chainData.expiry) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              userId: userId as any,
            });
          }
        }
        greeksCalculated = true;
      }
    }

    // Mark as processed
    await uploadRepo.markProcessed(upload._id.toString(), chainData as any);

    return {
      upload,
      extractedData: chainData,
      greeksCalculated,
    };
  } catch (error) {
    await uploadRepo.markError(upload._id.toString(), (error as Error).message);
    throw error;
  }
};

/**
 * Process a CSV upload.
 * Expects CSV with columns matching greek calculation input fields.
 */
export const processCsvUpload = async (
  file: Express.Multer.File,
  userId: string
): Promise<UploadResult> => {
  const upload = await uploadRepo.create({
    fileName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype,
    uploadType: 'csv',
    uploadedBy: userId,
  });

  try {
    // Read CSV file
    const content = fs.readFileSync(file.path, 'utf-8');
    const lines = content.split('\n').filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const results: Record<string, unknown>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row: Record<string, string> = {};

      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });

      // Try to calculate Greeks if all required fields are present
      if (
        row.commodity &&
        row.spotprice &&
        row.strike &&
        row.iv &&
        row.daystoexpiry &&
        row.optiontype
      ) {
        const input: GreeksCalculationInput = {
          commodity: row.commodity,
          spotPrice: parseFloat(row.spotprice),
          strike: parseFloat(row.strike),
          iv: parseFloat(row.iv),
          daysToExpiry: parseInt(row.daystoexpiry),
          optionType: row.optiontype.toUpperCase() as 'CALL' | 'PUT',
          riskFreeRate: row.riskfreerate ? parseFloat(row.riskfreerate) : env.RISK_FREE_RATE,
        };

        const greeks = calculateGreeks(input);
        await greekRepo.create({
          ...input,
          ...greeks,
          expiry: row.expiry ? new Date(row.expiry) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          userId: userId as any,
        });

        results.push({ ...input, ...greeks });
      }
    }

    const extractedData = { rowsProcessed: results.length, results };
    await uploadRepo.markProcessed(upload._id.toString(), extractedData as any);

    return {
      upload,
      extractedData,
      greeksCalculated: results.length > 0,
    };
  } catch (error) {
    await uploadRepo.markError(upload._id.toString(), (error as Error).message);
    throw error;
  }
};
