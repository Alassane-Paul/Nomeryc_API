import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { getQuote as getQuoteService } from './get.service';

export const getQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const quote = await getQuoteService(String(req.params.id), req.user?.id, req.user?.role);
  if (!quote) return sendError(res, '30', 'Devis non trouvé');
  return sendResponse(res, { data: quote });
});
