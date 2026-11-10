import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listPortfolioService } from './list.service';

export const getPortfolioItems = asyncHandler(async (req: Request, res: Response) => {
  return sendResponse(res, { data: await listPortfolioService(req.query) });
});
