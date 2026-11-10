import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deleteMessageService } from './delete.service';

export const deleteMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!await deleteMessageService(String(req.params.id), req.user?.id)) return sendError(res, '30', 'Message non trouvé');
  return sendResponse(res, { responseCode: '03', data: null });
});
