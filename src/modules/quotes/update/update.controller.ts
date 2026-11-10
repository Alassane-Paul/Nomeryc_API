import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updateQuote as updateQuoteService } from './update.service';

export const updateQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const quote = await updateQuoteService(String(req.params.id), req.body);
  if (!quote) return sendError(res, '30', 'Devis non trouvé');
  return sendResponse(res, { responseCode: '02', data: quote });
});
