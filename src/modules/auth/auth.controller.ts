import { Request, Response } from 'express';
import { sendResponse, sendError } from '../../utils/response';
import {
  loginService,
  registerService,
  getCurrentUserService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';

/**
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  }

  const result = await loginService(parsed.data);
  if (!result.success) {
    return sendError(res, result.errorCode || '99', result.errorMessage);
  }

  return sendResponse(res, {
    responseCode: '00',
    data: {
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
    },
  });
});

/**
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  }

  const result = await registerService(parsed.data);
  if (!result.success) {
    return sendError(res, result.errorCode || '99', result.errorMessage);
  }

  return sendResponse(res, {
    responseCode: '01',
    data: {
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
    },
  });
});

/**
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    return sendError(res, '20', 'Authentification requise');
  }

  const result = await getCurrentUserService(req.user.id);
  if (!result.success) {
    return sendError(res, result.errorCode || '99', result.errorMessage);
  }

  return sendResponse(res, { data: result.user });
});

/**
 * POST /api/v1/auth/refresh
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.headers['x-refresh-token'];
  if (!token) {
    return sendError(res, '20', 'Token de rafraîchissement requis');
  }

  const result = await refreshTokenService(String(token));
  if (!result.success) {
    return sendError(res, result.errorCode || '22', result.errorMessage);
  }

  return sendResponse(res, {
    data: {
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
    },
  });
});

/**
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  // Côté stateless, on informe simplement le client
  return sendResponse(res, {
    responseCode: '00',
    responseMessage: 'Déconnexion réussie',
    data: null,
  });
});

/**
 * POST /api/v1/auth/forgot-password
 * Réponse identique que l'email existe ou non, pour ne pas révéler les comptes existants.
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  }

  await forgotPasswordService(parsed.data.email);

  return sendResponse(res, {
    responseCode: '00',
    responseMessage: 'Si un compte existe avec cet email, un lien de réinitialisation vient de lui être envoyé.',
    data: null,
  });
});

/**
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  }

  const result = await resetPasswordService(parsed.data.token, parsed.data.password);
  if (!result.success) {
    return sendError(res, result.errorCode || '99', result.errorMessage);
  }

  return sendResponse(res, {
    responseCode: '00',
    responseMessage: 'Mot de passe réinitialisé avec succès.',
    data: null,
  });
});
