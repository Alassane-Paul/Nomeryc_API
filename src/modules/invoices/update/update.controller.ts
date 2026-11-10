import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { updateInvoiceService } from './update.service';

export const updateInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const invoice = await updateInvoiceService(String(req.params.id), req.body);
  if (!invoice) return sendError(res, '30', 'Facture non trouvée');
  return sendResponse(res, { responseCode: '02', data: invoice });
});
