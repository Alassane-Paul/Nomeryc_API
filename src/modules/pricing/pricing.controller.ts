import { Response, Request } from 'express';
import { PricingPlan } from '../../models/pricingPlan.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';

export const getPricingPlans = asyncHandler(async (_req: Request, res: Response) => {
  const items = await PricingPlan.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
  return sendResponse(res, { data: items });
});

export const getAllPricingPlans = asyncHandler(async (_req: Request, res: Response) => {
  const items = await PricingPlan.findAll({ order: [['orderIndex', 'ASC']] });
  return sendResponse(res, { data: items });
});

export const getPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const item = await PricingPlan.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Offre introuvable');
  return sendResponse(res, { data: item });
});

export const createPricingPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await PricingPlan.create(req.body);
  return sendResponse(res, { responseCode: '01', data: item });
});

export const updatePricingPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await PricingPlan.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Offre introuvable');
  await item.update(req.body);
  return sendResponse(res, { responseCode: '02', data: item });
});

export const deletePricingPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await PricingPlan.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Offre introuvable');
  await item.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
