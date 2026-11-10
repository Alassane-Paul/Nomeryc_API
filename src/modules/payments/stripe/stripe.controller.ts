import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { initStripePaymentService } from './stripe.service';

export const initStripePayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await initStripePaymentService(String(req.params.id), req.user?.id, req.user?.role);
  if (result === 'unconfigured') return sendError(res, '99', 'Le paiement par carte n\'est pas encore configuré.');
  if (result === 'not-found') return sendError(res, '30', 'Facture non trouvée');
  if (result === 'paid') return sendError(res, '12', 'Cette facture est déjà payée');
  if (result === 'client-not-found') return sendError(res, '30', 'Client introuvable');
  return sendResponse(res, { data: { url: result.url } });
});
