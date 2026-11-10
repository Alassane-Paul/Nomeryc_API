import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { createProject as createProjectService, projectSchema } from './create.service';

export const createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  const project = await createProjectService(parsed.data, req.user?.id, req.user?.role);
  return sendResponse(res, { responseCode: '01', data: project });
});
