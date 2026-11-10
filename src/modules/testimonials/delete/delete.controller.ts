import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deleteTestimonial as deleteTestimonialService } from './delete.service';

export const deleteTestimonial = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteTestimonialService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Témoignage introuvable');
  return sendResponse(res, { responseCode: '03', data: null });
});
