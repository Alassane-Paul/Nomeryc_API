import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deletePricingPlan as deletePricingPlanService } from './delete.service';

export const deletePricingPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deletePricingPlanService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Offre introuvable');
  return sendResponse(res, { responseCode: '03', data: null });
});
