import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { getPortfolioItemService } from './get.service';

export const getPortfolioItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await getPortfolioItemService(String(req.params.id));
  if (!item) return sendError(res, '30', 'Réalisation non trouvée');
  return sendResponse(res, { data: item });
});
