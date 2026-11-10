import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deleteNotificationService } from './delete.service';

export const deleteNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!await deleteNotificationService(String(req.params.id), req.user?.id)) return sendError(res, '30', 'Notification non trouvée');
  return sendResponse(res, { responseCode: '03', data: null });
});
