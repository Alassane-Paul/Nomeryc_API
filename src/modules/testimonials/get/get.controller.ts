import { Response, Request } from 'express';
import { sendResponse, sendError } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { getTestimonial as getTestimonialService } from './get.service';

export const getTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const item = await getTestimonialService(String(req.params.id));
  if (!item) return sendError(res, '30', 'Témoignage introuvable');
  return sendResponse(res, { data: item });
});
