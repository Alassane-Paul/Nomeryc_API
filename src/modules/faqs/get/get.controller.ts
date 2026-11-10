import { Request, Response } from 'express';
import { sendError, sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { getFaqService } from './get.service';

export const getFaq = asyncHandler(async (req: Request, res: Response) => {
  const item = await getFaqService(String(req.params.id));
  if (!item) return sendError(res, '30', 'Question introuvable');
  return sendResponse(res, { data: item });
});
