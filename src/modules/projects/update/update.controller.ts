import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updateProject as updateProjectService } from './update.service';

export const updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const project = await updateProjectService(String(req.params.id), req.body, req.user?.id, req.user?.role);
  if (!project) return sendError(res, '32', 'Projet non trouvé');
  return sendResponse(res, { responseCode: '02', data: project });
});
