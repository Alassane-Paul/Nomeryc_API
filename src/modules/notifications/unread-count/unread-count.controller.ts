import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { countUnreadNotificationsService } from './unread-count.service';

export const getUnreadCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  return sendResponse(res, { data: { count: await countUnreadNotificationsService(req.user?.id) } });
});
