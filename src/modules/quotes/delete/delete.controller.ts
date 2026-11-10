import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deleteQuote as deleteQuoteService } from './delete.service';

export const deleteQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteQuoteService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Devis non trouvé');
  return sendResponse(res, { responseCode: '03', data: null });
});
