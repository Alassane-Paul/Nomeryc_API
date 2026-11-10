import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { getUser as getUserService } from './get.service';

export const getUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await getUserService(String(req.params.id), req.user?.id, req.user?.role);
  if ('error' in result && result.error === 'forbidden') return sendError(res, '23', 'Accès refusé');
  if ('error' in result) return sendError(res, '31', 'Utilisateur non trouvé');
  return sendResponse(res, { data: result.user });
});
