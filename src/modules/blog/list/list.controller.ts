import { Request, Response } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { getPostsService } from './list.service';

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const data = await getPostsService(req.query);
  return sendResponse(res, { data });
});
