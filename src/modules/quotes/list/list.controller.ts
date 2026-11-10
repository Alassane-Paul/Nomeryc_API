import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listQuotes } from './list.service';

export const getQuotes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const quotes = await listQuotes(req.user?.id, req.user?.role);
  return sendResponse(res, { data: quotes });
});
