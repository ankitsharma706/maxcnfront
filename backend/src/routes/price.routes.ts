import { Router } from 'express';
import {
  manualEntry,
  uploadChartPrice,
  getLatest,
  getHistory,
} from '../controllers/price.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { manualPriceSchema } from '../validators/price.validator';
import { uploadChart } from '../middleware/upload';

const router = Router();

// All price routes require authentication
router.use(authenticate);

/**
 * POST /api/price/manual
 * Manually enter a commodity price.
 */
router.post('/manual', validate(manualPriceSchema), manualEntry);

/**
 * POST /api/price/upload-chart
 * Upload a chart screenshot to extract price.
 * Form field: 'chart'
 */
router.post('/upload-chart', uploadChart, uploadChartPrice);

/**
 * GET /api/price/latest
 * Get the latest price(s). Optional query: ?commodity=Gold Mini
 */
router.get('/latest', getLatest);

/**
 * GET /api/price/history
 * Get price history. Required query: ?commodity=Gold Mini
 */
router.get('/history', getHistory);

export default router;
