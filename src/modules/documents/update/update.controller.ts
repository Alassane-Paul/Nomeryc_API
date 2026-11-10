import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { updateDocumentService } from './update.service';

export const updateDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await updateDocumentService(String(req.params.id), req.body);
  if ('error' in result && result.error === 'not-found') return sendError(res, '30', 'Document non trouvé');
  if ('error' in result && result.error === 'invalid') {
    return sendError(res, '10', 'Données invalides', result.details);
  }
  return sendResponse(res, { responseCode: '02', data: result.document });
});
