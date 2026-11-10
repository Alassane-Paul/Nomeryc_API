import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { markAllNotificationsReadService } from './read-all.service';

export const markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await markAllNotificationsReadService(req.user?.id);
  return sendResponse(res, { responseCode: '02', data: null });
});
