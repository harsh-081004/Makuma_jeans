import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.js';
import { login, register, getMe, setup } from '../controllers/authController.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/register', authenticate, authorize('superadmin'), validate(registerSchema), register);
router.get('/me', authenticate, getMe);
router.post('/setup', validate(registerSchema), setup);

export default router;
