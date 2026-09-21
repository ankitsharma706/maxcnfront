import { Router } from 'express';
import {
  getDelta,
  getGamma,
  getTheta,
  getVega,
  getIV,
  getPCR,
  getMaxPain,
} from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

/**
 * GET /api/analytics/delta
 * Delta exposure analysis.
 */
router.get('/delta', getDelta);

/**
 * GET /api/analytics/gamma
 * Gamma exposure (GEX) analysis.
 */
router.get('/gamma', getGamma);

/**
 * GET /api/analytics/theta
 * Theta decay analysis.
 */
router.get('/theta', getTheta);

/**
 * GET /api/analytics/vega
 * Vega exposure analysis.
 */
router.get('/vega', getVega);

/**
 * GET /api/analytics/iv
 * Implied volatility analysis and skew.
 */
router.get('/iv', getIV);

/**
 * GET /api/analytics/pcr
 * Put-Call Ratio analysis.
 */
router.get('/pcr', getPCR);

/**
 * GET /api/analytics/maxpain
 * Max Pain analysis.
 */
router.get('/maxpain', getMaxPain);

export default router;
