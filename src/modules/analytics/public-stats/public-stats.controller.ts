import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { getPublicStatsService } from './public-stats.service';

export const getPublicStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const data = await getPublicStatsService();
  return sendResponse(res, { data });
});
