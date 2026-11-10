import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { countUnreadMessagesService } from './unread-count.service';

export const getUnreadMessageCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const count = await countUnreadMessagesService(req.user!.id, req.user!.role);
  return sendResponse(res, { data: { count } });
});
