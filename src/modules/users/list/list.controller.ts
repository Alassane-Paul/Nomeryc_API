import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listUsers } from './list.service';

export const getUsers = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const users = await listUsers();
  return sendResponse(res, { data: users });
});
