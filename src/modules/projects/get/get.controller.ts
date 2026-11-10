import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { getProject as getProjectService } from './get.service';

export const getProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const project = await getProjectService(String(req.params.id), req.user?.id, req.user?.role);
  if (!project) return sendError(res, '32', 'Projet non trouvé');
  return sendResponse(res, { data: project });
});
