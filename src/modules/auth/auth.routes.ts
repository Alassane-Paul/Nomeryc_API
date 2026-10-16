import { Router } from 'express';
import { login, register, getMe, refreshToken, logout, forgotPassword, resetPassword } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const authRouter = Router();

// Rate limiting strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { responseCode: '98', responseMessage: 'Trop de tentatives, réessayez dans 15 minutes.' },
});

authRouter.post('/login', authLimiter, login);
authRouter.post('/register', register);
authRouter.post('/refresh', refreshToken);
authRouter.post('/forgot-password', authLimiter, forgotPassword);
authRouter.post('/reset-password', authLimiter, resetPassword);
authRouter.get('/me', authMiddleware, getMe);
authRouter.post('/logout', authMiddleware, logout);

export default authRouter;
