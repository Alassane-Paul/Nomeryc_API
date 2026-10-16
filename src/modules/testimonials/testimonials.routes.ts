import { Router } from 'express';
import {
  getTestimonials,
  getTestimonial,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from './testimonials.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const testimonialsRouter = Router();

testimonialsRouter.get('/', getTestimonials);
testimonialsRouter.get('/admin/all', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getAllTestimonials);
testimonialsRouter.get('/:id', getTestimonial);
testimonialsRouter.post('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), createTestimonial);
testimonialsRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updateTestimonial);
testimonialsRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deleteTestimonial);

export default testimonialsRouter;
