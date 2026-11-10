import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { markAllMessagesReadService } from './read-all.service';

export const markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!await markAllMessagesReadService(req.user!, req.body, req.query)) return sendError(res, '11', 'clientId requis');
  return sendResponse(res, { responseMessage: 'Tous les messages marqués comme lus', data: null });
});
