import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { sendMessageService } from './send.service';

export const sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await sendMessageService(req.user!, req.body);
  if ('error' in result) return sendError(res, '11', result.error);
  return sendResponse(res, { responseCode: '01', data: result.message });
});
