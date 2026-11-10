import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { refreshTokenService } from './refresh-token.service';

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
