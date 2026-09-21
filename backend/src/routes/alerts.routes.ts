import { Router } from 'express';
import { getAlerts, addAlert, removeAlert } from '../controllers/alerts.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Require authentication
router.use(authenticate);

/**
 * GET /api/alerts
 * Get all alerts for the authenticated user.
 */
router.get('/', getAlerts);

/**
 * POST /api/alerts
 * Create a new alert.
 */
router.post('/', addAlert);

/**
 * DELETE /api/alerts/:id
 * Delete an alert.
 */
router.delete('/:id', removeAlert);

export default router;
