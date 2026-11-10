import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { updatePostService } from './update.service';

export const updatePost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const post = await updatePostService(String(req.params.id), req.body);
  if (!post) return sendError(res, '30', 'Article non trouvé');
  return sendResponse(res, { responseCode: '02', data: post });
});
