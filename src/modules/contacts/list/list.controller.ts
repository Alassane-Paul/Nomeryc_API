import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { getContactRequestsService } from './list.service';

export const getContactRequests = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = await getContactRequestsService(req.query.status);
  return sendResponse(res, { data });
});
