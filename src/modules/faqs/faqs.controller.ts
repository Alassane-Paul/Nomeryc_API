import { Response, Request } from 'express';
import { Faq } from '../../models/faq.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';

export const getFaqs = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Faq.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
  return sendResponse(res, { data: items });
});

export const getAllFaqs = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Faq.findAll({ order: [['orderIndex', 'ASC']] });
  return sendResponse(res, { data: items });
});

export const getFaq = asyncHandler(async (req: Request, res: Response) => {
  const item = await Faq.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Question introuvable');
  return sendResponse(res, { data: item });
});

export const createFaq = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await Faq.create(req.body);
  return sendResponse(res, { responseCode: '01', data: item });
});

export const updateFaq = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await Faq.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Question introuvable');
  await item.update(req.body);
  return sendResponse(res, { responseCode: '02', data: item });
});

export const deleteFaq = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await Faq.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Question introuvable');
  await item.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
