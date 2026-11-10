import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deletePostService } from './delete.service';

export const deletePost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deletePostService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Article non trouvé');
  return sendResponse(res, { responseCode: '03', data: null });
});
