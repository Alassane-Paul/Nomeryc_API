import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listAllPortfolioService } from './admin-list.service';

export const getAllPortfolioItems = asyncHandler(async (_req: Request, res: Response) => {
  return sendResponse(res, { data: await listAllPortfolioService() });
});
