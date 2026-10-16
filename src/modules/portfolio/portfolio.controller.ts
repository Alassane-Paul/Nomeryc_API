import { Response, Request } from 'express';
import { PortfolioItem } from '../../models/portfolioItem.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';

export const getPortfolioItems = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured } = req.query;
  const where: any = { isPublic: true };
  if (category) where.category = category;
  if (featured === 'true') where.featured = true;

  const items = await PortfolioItem.findAll({
    where,
    order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']],
  });

  return sendResponse(res, { data: items });
});

export const getAllPortfolioItems = asyncHandler(async (_req: Request, res: Response) => {
  const items = await PortfolioItem.findAll({ order: [['orderIndex', 'ASC']] });
  return sendResponse(res, { data: items });
});

export const getPortfolioItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await PortfolioItem.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Réalisation non trouvée');
  return sendResponse(res, { data: item });
});

export const createPortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await PortfolioItem.create(req.body);
  return sendResponse(res, { responseCode: '01', data: item });
});

export const updatePortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await PortfolioItem.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Réalisation non trouvée');
  await item.update(req.body);
  return sendResponse(res, { responseCode: '02', data: item });
});

export const deletePortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await PortfolioItem.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Réalisation non trouvée');
  await item.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
