import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { listInvoicesService } from './list.service';

export const getInvoices = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const invoices = await listInvoicesService(req.user?.id, req.user?.role);
  return sendResponse(res, { data: invoices });
});
