import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listProjects } from './list.service';

export const getProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const projects = await listProjects(req.user?.id, req.user?.role);
  return sendResponse(res, { data: projects });
});
