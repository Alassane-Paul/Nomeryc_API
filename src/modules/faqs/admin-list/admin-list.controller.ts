import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { getAllFaqsService } from './admin-list.service';

export const getAllFaqs = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const data = await getAllFaqsService();
  return sendResponse(res, { data });
});
