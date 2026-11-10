import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { getDashboardAnalyticsService } from './dashboard.service';

export const getDashboardAnalytics = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const data = await getDashboardAnalyticsService();
  return sendResponse(res, { data });
});
