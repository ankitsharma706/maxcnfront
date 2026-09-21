import { Router } from 'express';
import {
  uploadChart,
  uploadOptionChain,
  uploadCsv,
} from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';
import {
  uploadChart as uploadChartMiddleware,
  uploadOptionChain as uploadOptionChainMiddleware,
  uploadCsv as uploadCsvMiddleware,
} from '../middleware/upload';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

/**
 * POST /api/upload/chart
 * Upload a chart screenshot for OCR price extraction.
 * Form field: 'chart'
 */
router.post('/chart', uploadChartMiddleware, uploadChart);

/**
 * POST /api/upload/option-chain
 * Upload an option chain screenshot for OCR extraction.
 * Form field: 'optionChain'
 */
router.post('/option-chain', uploadOptionChainMiddleware, uploadOptionChain);

/**
 * POST /api/upload/csv
 * Upload a CSV or XLSX file with option data.
 * Form field: 'file'
 */
router.post('/csv', uploadCsvMiddleware, uploadCsv);

export default router;
