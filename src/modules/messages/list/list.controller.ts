import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { listMessagesService } from './list.service';

export const getMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await listMessagesService(req.user?.id, req.user?.role, req.query);
  if ('error' in result) return sendError(res, '11', result.error);
  return sendResponse(res, { data: result.messages });
});
