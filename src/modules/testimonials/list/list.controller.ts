import { Response, Request } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { listTestimonials } from './list.service';

export const getTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const items = await listTestimonials();
  return sendResponse(res, { data: items });
});
