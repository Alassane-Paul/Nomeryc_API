import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { updateFaqService } from './update.service';

export const updateFaq = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await updateFaqService(String(req.params.id), req.body);
  if (!item) return sendError(res, '30', 'Question introuvable');
  return sendResponse(res, { responseCode: '02', data: item });
});
