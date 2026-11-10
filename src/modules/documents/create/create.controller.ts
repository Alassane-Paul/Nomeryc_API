import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { createDocumentService } from './create.service';

export const createDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await createDocumentService(req.body, req.user?.id);
  if ('error' in result && result.error === 'invalid') {
    return sendError(res, '10', 'Données invalides', result.details);
  }
  if ('error' in result && result.error === 'client-not-found') return sendError(res, '31', 'Client non trouvé');
  return sendResponse(res, { responseCode: '01', data: result.document });
});
