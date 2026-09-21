import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';
import {
  fixOcrNumber,
  parseOcrNumber,
  extractLines,
  isTableRow,
  splitTableRow,
  detectCommodity,
  extractNumberNearKeyword,
  detectHeaders,
  parseOptionChainRows,
  OptionChainRow,
} from '../utils/parser';

export interface OcrChartResult {
  commodity: string | null;
  currentPrice: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  rawText: string;
  confidence: number;
}

export interface OcrOptionChainResult {
  commodity: string | null;
  expiry: string | null;
  strikes: OptionChainRow[];
  rawText: string;
  confidence: number;
}

/**
 * Preprocess image for better OCR accuracy.
 * Applies grayscale, contrast enhancement, sharpening, and noise removal.
 */
const preprocessImage = async (inputPath: string): Promise<string> => {
  const outputDir = path.dirname(inputPath);
  const outputPath = path.join(outputDir, `processed_${path.basename(inputPath)}.png`);

  try {
    await sharp(inputPath)
      .grayscale()                          // Convert to grayscale
      .normalize()                          // Normalize contrast
      .sharpen({ sigma: 1.5 })             // Sharpen edges
      .median(3)                            // Remove salt-and-pepper noise
      .threshold(128)                       // Binarize for cleaner text
      .png()
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    logger.warn('Image preprocessing failed, using original:', error);
    return inputPath;
  }
};

/**
 * Run Tesseract OCR on an image file.
 */
const runOcr = async (imagePath: string): Promise<{ text: string; confidence: number }> => {
  try {
    const processedPath = await preprocessImage(imagePath);

    const result = await Tesseract.recognize(processedPath, 'eng', {
      logger: (info) => {
        if (info.status === 'recognizing text') {
          logger.debug(`OCR Progress: ${Math.round((info.progress || 0) * 100)}%`);
        }
      },
    });

    // Clean up processed file if different from original
    if (processedPath !== imagePath && fs.existsSync(processedPath)) {
      fs.unlinkSync(processedPath);
    }

    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  } catch (error) {
    logger.error('OCR processing failed:', error);
    throw new Error('Failed to process image with OCR');
  }
};

/**
 * Extract chart data (price) from a TradingView or broker chart screenshot.
 */
export const extractChartData = async (imagePath: string): Promise<OcrChartResult> => {
  const { text, confidence } = await runOcr(imagePath);
  logger.debug('OCR Raw Text (Chart):', text);

  const commodity = detectCommodity(text);

  // Try to extract prices using common keywords
  const currentPrice = extractNumberNearKeyword(text, [
    'ltp', 'last', 'price', 'close', 'current', 'cmp',
  ]);

  const open = extractNumberNearKeyword(text, ['open', 'o:']);
  const high = extractNumberNearKeyword(text, ['high', 'h:']);
  const low = extractNumberNearKeyword(text, ['low', 'l:']);
  const close = extractNumberNearKeyword(text, ['close', 'c:', 'prev']);

  return {
    commodity,
    currentPrice,
    open,
    high,
    low,
    close,
    rawText: text,
    confidence,
  };
};

/**
 * Extract option chain data from a broker screenshot.
 * Supports Groww, Zerodha, Upstox, TradingView, Angel One, MCX formats.
 */
export const extractOptionChainData = async (
  imagePath: string
): Promise<OcrOptionChainResult> => {
  const { text, confidence } = await runOcr(imagePath);
  logger.debug('OCR Raw Text (Option Chain):', text);

  const commodity = detectCommodity(text);

  // Try to extract expiry date
  const expiryMatch = text.match(
    /(\d{1,2}[-/]\w{3}[-/]\d{2,4}|\d{1,2}\s+\w{3,9}\s+\d{2,4}|\d{2,4}[-/]\d{2}[-/]\d{2})/i
  );
  const expiry = expiryMatch ? expiryMatch[0] : null;

  // Parse table structure
  const lines = extractLines(text);
  let headers: string[] = [];
  const dataRows: string[][] = [];

  let headerFound = false;

  for (const line of lines) {
    if (!headerFound) {
      // Look for header row containing 'strike' or column identifiers
      const lowerLine = line.toLowerCase();
      if (
        lowerLine.includes('strike') ||
        lowerLine.includes('oi') ||
        (lowerLine.includes('call') && lowerLine.includes('put'))
      ) {
        headers = detectHeaders(line);
        headerFound = true;
        continue;
      }
    }

    if (headerFound && isTableRow(line)) {
      const columns = splitTableRow(line);
      // Apply OCR correction to each column
      const correctedColumns = columns.map((col) => {
        // If the column looks numeric, fix OCR errors
        if (/[\dOlISBGgZzTD.,\-]/.test(col)) {
          return fixOcrNumber(col);
        }
        return col;
      });
      dataRows.push(correctedColumns);
    }
  }

  // Parse structured rows
  let strikes: OptionChainRow[] = [];
  if (headers.length > 0 && dataRows.length > 0) {
    strikes = parseOptionChainRows(headers, dataRows);
  }

  return {
    commodity,
    expiry,
    strikes,
    rawText: text,
    confidence,
  };
};

/**
 * Determine the type of screenshot and extract data accordingly.
 */
export const processScreenshot = async (
  imagePath: string,
  uploadType: 'chart' | 'option-chain'
): Promise<OcrChartResult | OcrOptionChainResult> => {
  if (uploadType === 'chart') {
    return extractChartData(imagePath);
  } else {
    return extractOptionChainData(imagePath);
  }
};
