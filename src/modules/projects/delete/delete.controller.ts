import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deleteProject as deleteProjectService } from './delete.service';

export const deleteProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteProjectService(String(req.params.id));
  if (!deleted) return sendError(res, '32', 'Projet non trouvé');
  return sendResponse(res, { responseCode: '03', data: null });
});
