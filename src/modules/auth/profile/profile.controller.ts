import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { getCurrentUserService } from './profile.service';

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
