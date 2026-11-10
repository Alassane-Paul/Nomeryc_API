import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { createInvoiceService } from './create.service';

export const createInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const invoice = await createInvoiceService(req.body);
  return sendResponse(res, { responseCode: '01', data: invoice });
});
