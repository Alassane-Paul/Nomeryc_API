import { Request, Response } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { getFaqsService } from './list.service';

export const getFaqs = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getFaqsService();
  return sendResponse(res, { data });
});
