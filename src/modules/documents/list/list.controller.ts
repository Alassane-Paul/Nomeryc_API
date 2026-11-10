import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { getDocumentsService } from './list.service';

export const getDocuments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = await getDocumentsService(req.user, req.query);
  return sendResponse(res, { data });
});
