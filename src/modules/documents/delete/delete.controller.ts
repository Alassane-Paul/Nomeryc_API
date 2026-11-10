import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deleteDocumentService } from './delete.service';

export const deleteDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteDocumentService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Document non trouvé');
  return sendResponse(res, { responseCode: '03', data: null });
});
