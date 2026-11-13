import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deleteUpload as deleteUploadService } from './delete.service';

export const deleteUpload = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteUploadService(String(req.params.filename));
  if (!deleted) return sendError(res, '30', 'Fichier non trouvé');
  return sendResponse(res, { responseCode: '03', data: null });
});
