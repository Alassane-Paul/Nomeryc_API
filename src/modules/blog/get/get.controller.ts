import { Request, Response } from 'express';
import { sendError, sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { getPostService } from './get.service';

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await getPostService(req.params.slug as string);
  if (!post) return sendError(res, '30', 'Article non trouvé');
  return sendResponse(res, { data: post });
});
