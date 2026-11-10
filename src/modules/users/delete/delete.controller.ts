import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deleteUser as deleteUserService } from './delete.service';

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteUserService(String(req.params.id));
  if (!deleted) return sendError(res, '31', 'Utilisateur non trouvé');
  return sendResponse(res, { responseCode: '03', data: null });
});
