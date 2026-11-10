import { Request, Response } from 'express';
import { sendError, sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { loginSchema, loginService } from './login.service';

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
