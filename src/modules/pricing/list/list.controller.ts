import { Response, Request } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { listPricingPlans } from './list.service';

export const getPricingPlans = asyncHandler(async (_req: Request, res: Response) => {
  const items = await listPricingPlans();
  return sendResponse(res, { data: items });
});
