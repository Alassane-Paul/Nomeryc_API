import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { createPostService } from './create.service';

export const createPost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const post = await createPostService(req.body, req.user!.id);
  return sendResponse(res, { responseCode: '01', data: post });
});
