import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { markNotificationReadService } from './read.service';

export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const notification = await markNotificationReadService(String(req.params.id), req.user?.id);
  if (!notification) return sendError(res, '30', 'Notification non trouvée');
  return sendResponse(res, { responseCode: '02', data: notification });
});
