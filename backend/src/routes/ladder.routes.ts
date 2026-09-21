import { Router } from 'express';
import { getLadder } from '../controllers/ladder.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Require authentication
router.use(authenticate);

/**
 * GET /api/ladder
 * Get Greeks Ladder for a commodity.
 */
router.get('/', getLadder);

export default router;
