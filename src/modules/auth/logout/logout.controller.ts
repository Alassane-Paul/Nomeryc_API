import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';

export const logout = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  return sendResponse(res, {
    responseCode: '00',
    responseMessage: 'Déconnexion réussie',
    data: null,
  });
});
