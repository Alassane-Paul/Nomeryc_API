import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { createTestimonial as createTestimonialService } from './create.service';

export const createTestimonial = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await createTestimonialService(req.body);
  return sendResponse(res, { responseCode: '01', data: item });
});
