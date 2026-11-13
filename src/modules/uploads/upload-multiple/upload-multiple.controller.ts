import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { formatMultipleUploads } from './upload-multiple.service';

export const uploadMultiple = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const files = formatMultipleUploads(req.files as Express.Multer.File[] | undefined);
  if (!files) return sendError(res, '11', 'Aucun fichier fourni');
  return sendResponse(res, { responseCode: '01', data: files });
});
