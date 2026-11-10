import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { createPricingPlan as createPricingPlanService } from './create.service';

export const createPricingPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await createPricingPlanService(req.body);
  return sendResponse(res, { responseCode: '01', data: item });
});
