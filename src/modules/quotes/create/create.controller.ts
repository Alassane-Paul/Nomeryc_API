import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { createQuote as createQuoteService, quoteSchema } from './create.service';

export const createQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  const quote = await createQuoteService(parsed.data, req.user!.id);
  return sendResponse(res, { responseCode: '01', data: quote });
});
