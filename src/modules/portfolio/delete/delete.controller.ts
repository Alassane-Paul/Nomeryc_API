import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deletePortfolioItemService } from './delete.service';

export const deletePortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!await deletePortfolioItemService(String(req.params.id))) return sendError(res, '30', 'Réalisation non trouvée');
  return sendResponse(res, { responseCode: '03', data: null });
});
