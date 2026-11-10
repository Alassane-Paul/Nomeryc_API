import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { markMessageReadService } from './read.service';

export const markMessageAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await markMessageReadService(String(req.params.id), req.user!);
  if (result === 'missing') return sendError(res, '30', 'Message non trouvé');
  if (result === 'forbidden') return sendError(res, '23', 'Accès refusé');
  return sendResponse(res, { responseCode: '02', data: result });
});
