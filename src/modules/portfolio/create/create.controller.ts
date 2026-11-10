import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { createPortfolioItemService } from './create.service';

export const createPortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  return sendResponse(res, { responseCode: '01', data: await createPortfolioItemService(req.body) });
});
