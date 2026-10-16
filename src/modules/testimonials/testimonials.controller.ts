import { Response, Request } from 'express';
import { Testimonial } from '../../models/testimonial.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';

export const getTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Testimonial.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
  return sendResponse(res, { data: items });
});

export const getAllTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Testimonial.findAll({ order: [['orderIndex', 'ASC']] });
  return sendResponse(res, { data: items });
});

export const getTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const item = await Testimonial.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Témoignage introuvable');
  return sendResponse(res, { data: item });
});

export const createTestimonial = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await Testimonial.create(req.body);
  return sendResponse(res, { responseCode: '01', data: item });
});

export const updateTestimonial = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await Testimonial.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Témoignage introuvable');
  await item.update(req.body);
  return sendResponse(res, { responseCode: '02', data: item });
});

export const deleteTestimonial = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const item = await Testimonial.findByPk(String(req.params.id));
  if (!item) return sendError(res, '30', 'Témoignage introuvable');
  await item.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
