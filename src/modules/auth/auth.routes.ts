import { Router } from 'express';
import { login } from './login/login.controller';
import { register } from './register/register.controller';
import { getMe } from './profile/profile.controller';
import { refreshToken } from './refresh-token/refresh-token.controller';
import { logout } from './logout/logout.controller';
import { forgotPassword } from './forgot-password/forgot-password.controller';
import { resetPassword } from './reset-password/reset-password.controller';
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
