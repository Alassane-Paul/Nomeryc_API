import { Router } from 'express';
import { getFaqs, getFaq, getAllFaqs, createFaq, updateFaq, deleteFaq } from './faqs.controller';
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
