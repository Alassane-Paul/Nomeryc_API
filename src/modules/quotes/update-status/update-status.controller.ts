import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updateQuoteStatus as updateQuoteStatusService } from './update-status.service';

export const updateQuoteStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await updateQuoteStatusService(
    String(req.params.id),
    req.user?.id,
    req.user?.role,
    req.body.status,
  );
  if ('error' in result && result.error === 'not-found') return sendError(res, '30', 'Devis non trouvé');
  if ('error' in result && result.error === 'invalid-status') return sendError(res, '10', 'Statut invalide');
  if ('error' in result) return sendError(res, '23', 'Action non autorisée');
  return sendResponse(res, { responseCode: '02', data: result.quote });
});
