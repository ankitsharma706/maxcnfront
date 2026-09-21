import { Router } from 'express';
import {
  calculate,
  scenario,
  getHistory,
  getById,
  deleteById,
} from '../controllers/greeks.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { calculateGreeksSchema, scenarioSchema } from '../validators/greek.validator';

const router = Router();

// All greeks routes require authentication
router.use(authenticate);

/**
 * POST /api/greeks/calculate
 * Calculate Greeks for an option position.
 */
router.post('/calculate', validate(calculateGreeksSchema), calculate);

/**
 * POST /api/greeks/scenario
 * Run scenario analysis with multiple price moves.
 */
router.post('/scenario', validate(scenarioSchema), scenario);

/**
 * GET /api/greeks/history
 * Get calculation history for the authenticated user.
 */
router.get('/history', getHistory);

/**
 * GET /api/greeks/:id
 * Get a specific Greek calculation.
 */
router.get('/:id', getById);

/**
 * DELETE /api/greeks/:id
 * Delete a Greek calculation.
 */
router.delete('/:id', deleteById);

export default router;
