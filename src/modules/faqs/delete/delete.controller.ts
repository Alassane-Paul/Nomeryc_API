import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deleteFaqService } from './delete.service';

export const deleteFaq = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteFaqService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Question introuvable');
  return sendResponse(res, { responseCode: '03', data: null });
});
