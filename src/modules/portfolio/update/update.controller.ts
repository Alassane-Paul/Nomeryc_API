import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { updatePortfolioItemService } from './update.service';

export const updatePortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await updatePortfolioItemService(String(req.params.id), req.body);
  if (!item) return sendError(res, '30', 'Réalisation non trouvée');
  return sendResponse(res, { responseCode: '02', data: item });
});
