import { Router } from 'express';
import {
  getTestimonials,
} from './list/list.controller';
import { getTestimonial } from './get/get.controller';
import { getAllTestimonials } from './list-all/list-all.controller';
import { createTestimonial } from './create/create.controller';
import { updateTestimonial } from './update/update.controller';
import { deleteTestimonial } from './delete/delete.controller';
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
