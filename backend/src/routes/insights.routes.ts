import { Router } from 'express';
import { getInsights } from '../controllers/insights.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Require authentication
router.use(authenticate);

/**
 * GET /api/insights
 * Get AI Insights for a commodity.
 */
router.get('/', getInsights);

export default router;
