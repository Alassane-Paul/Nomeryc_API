import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listTasks } from './list.service';

export const getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tasks = await listTasks(req.query);
  return sendResponse(res, { data: tasks });
});
