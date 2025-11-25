import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { check } from 'express-validator';
import validate from '../middleware/validate';
import { loginLimiter, registerLimiter } from '../middleware/authRateLimiter';

const router = Router();

router.post(
  '/register',
  registerLimiter,
  [
    check('username').notEmpty().withMessage('username required').isLength({ min: 3 }).withMessage('username too short'),
    check('email').isEmail().withMessage('valid email required'),
    check('password').isLength({ min: 6 }).withMessage('password min 6 chars')
  ],
  validate,
  register
);

router.post(
  '/login',
  loginLimiter,
  [
    check('email').isEmail().withMessage('valid email required'),
    check('password').notEmpty().withMessage('password required')
  ],
  validate,
  login
);

export default router;
