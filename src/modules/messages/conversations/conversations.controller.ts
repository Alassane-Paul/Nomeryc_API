import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listConversationsService } from './conversations.service';

export const getConversations = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  return sendResponse(res, { data: await listConversationsService() });
});
