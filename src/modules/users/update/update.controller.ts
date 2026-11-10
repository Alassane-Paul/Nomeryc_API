import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updateUser as updateUserService } from './update.service';

export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await updateUserService(String(req.params.id), req.user?.id, req.user?.role, req.body);
  if ('error' in result && result.error === 'forbidden') return sendError(res, '23', 'Accès refusé');
  if ('error' in result) return sendError(res, '31', 'Utilisateur non trouvé');
  return sendResponse(res, { responseCode: '02', data: result.updated });
});
