import { Response, Request } from 'express';
import { sendResponse, sendError } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { getPricingPlan as getPricingPlanService } from './get.service';

export const getPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const item = await getPricingPlanService(String(req.params.id));
  if (!item) return sendError(res, '30', 'Offre introuvable');
  return sendResponse(res, { data: item });
});
