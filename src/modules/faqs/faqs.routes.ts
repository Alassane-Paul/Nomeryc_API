import { Router } from 'express';
import { getFaqs } from './list/list.controller';
import { getAllFaqs } from './admin-list/admin-list.controller';
import { getFaq } from './get/get.controller';
import { createFaq } from './create/create.controller';
import { updateFaq } from './update/update.controller';
import { deleteFaq } from './delete/delete.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const faqsRouter = Router();

faqsRouter.get('/', getFaqs);
faqsRouter.get('/admin/all', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getAllFaqs);
faqsRouter.get('/:id', getFaq);
faqsRouter.post('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), createFaq);
faqsRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updateFaq);
faqsRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deleteFaq);

export default faqsRouter;
