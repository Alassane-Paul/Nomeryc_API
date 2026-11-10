import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { initFedapayPaymentService } from './fedapay.service';

export const initFedapayPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await initFedapayPaymentService(String(req.params.id), req.user?.id, req.user?.role, req.body);
  if (result === 'unconfigured') return sendError(res, '99', 'Le paiement Mobile Money n\'est pas encore configuré.');
  if (result === 'not-found') return sendError(res, '30', 'Facture non trouvée');
  if (result === 'paid') return sendError(res, '12', 'Cette facture est déjà payée');
  if (result === 'client-not-found') return sendError(res, '30', 'Client introuvable');
  if (result === 'transaction-error') return sendError(res, '99', 'Impossible de créer la transaction Mobile Money pour le moment.');
  return sendResponse(res, { data: { url: result.url } });
});
