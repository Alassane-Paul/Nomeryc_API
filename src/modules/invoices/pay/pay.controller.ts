import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { markInvoicePaidService } from './pay.service';

export const markAsPaid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await markInvoicePaidService(String(req.params.id), req.user?.id, req.user?.role, req.body);
  if (!result.invoice) return sendError(res, '30', 'Facture non trouvée');
  return sendResponse(res, {
    responseCode: '02', responseMessage: 'Facture marquée comme payée', data: result.invoice,
  });
});
