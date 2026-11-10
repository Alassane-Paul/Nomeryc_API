import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { getInvoiceService } from './get.service';

export const getInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const invoice = await getInvoiceService(String(req.params.id), req.user?.id, req.user?.role);
  if (!invoice) return sendError(res, '30', 'Facture non trouvée');
  return sendResponse(res, { data: invoice });
});
