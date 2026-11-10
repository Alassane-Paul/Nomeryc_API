import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { getAllPostsService } from './admin-list.service';

export const getAllPosts = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const data = await getAllPostsService();
  return sendResponse(res, { data });
});
