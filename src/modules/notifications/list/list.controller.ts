import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listNotificationsService } from './list.service';

export const getNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  return sendResponse(res, { data: await listNotificationsService(req.user?.id, req.query) });
});
