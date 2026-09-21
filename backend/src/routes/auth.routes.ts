import { Router } from 'express';
import { register, login, refresh } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator';

const router = Router();

/**
 * POST /api/auth/register
 * @body { name, email, password }
 */
router.post('/register', validate(registerSchema), register);

/**
 * POST /api/auth/login
 * @body { email, password }
 */
router.post('/login', validate(loginSchema), login);

/**
 * POST /api/auth/refresh
 * @body { refreshToken }
 */
router.post('/refresh', validate(refreshSchema), refresh);

export default router;
