import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { formatSingleUpload } from './upload-single.service';

export const uploadSingle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const file = formatSingleUpload(req.file);
  if (!file) return sendError(res, '11', 'Aucun fichier fourni');
  return sendResponse(res, { responseCode: '01', data: file });
});
