import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updateTestimonial as updateTestimonialService } from './update.service';

export const updateTestimonial = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await updateTestimonialService(String(req.params.id), req.body);
  if (!item) return sendError(res, '30', 'Témoignage introuvable');
  return sendResponse(res, { responseCode: '02', data: item });
});
