import { Response, Request } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { listAllPricingPlans } from './list-all.service';

export const getAllPricingPlans = asyncHandler(async (_req: Request, res: Response) => {
  const items = await listAllPricingPlans();
  return sendResponse(res, { data: items });
});
