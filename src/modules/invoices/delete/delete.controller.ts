import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deleteInvoiceService } from './delete.service';

export const deleteInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!await deleteInvoiceService(String(req.params.id))) return sendError(res, '30', 'Facture non trouvée');
  return sendResponse(res, { responseCode: '03', data: null });
});
