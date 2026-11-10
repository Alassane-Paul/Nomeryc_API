import { Response, Request } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { listAllTestimonials } from './list-all.service';

export const getAllTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const items = await listAllTestimonials();
  return sendResponse(res, { data: items });
});
