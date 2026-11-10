import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updatePricingPlan as updatePricingPlanService } from './update.service';

export const updatePricingPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await updatePricingPlanService(String(req.params.id), req.body);
  if (!item) return sendError(res, '30', 'Offre introuvable');
  return sendResponse(res, { responseCode: '02', data: item });
});
