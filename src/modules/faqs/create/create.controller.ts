import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { createFaqService } from './create.service';

export const createFaq = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await createFaqService(req.body);
  return sendResponse(res, { responseCode: '01', data: item });
});
