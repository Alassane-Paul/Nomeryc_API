import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { createTask as createTaskService, taskSchema } from './create.service';

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  const task = await createTaskService(parsed.data, req.user?.id);
  return sendResponse(res, { responseCode: '01', data: task });
});
