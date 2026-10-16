import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes';
import projectsRouter from '../modules/projects/projects.routes';
import quotesRouter from '../modules/quotes/quotes.routes';
import invoicesRouter from '../modules/invoices/invoices.routes';
import blogRouter from '../modules/blog/blog.routes';
import portfolioRouter from '../modules/portfolio/portfolio.routes';
import contactsRouter from '../modules/contacts/contacts.routes';
import messagesRouter from '../modules/messages/messages.routes';
import uploadsRouter from '../modules/uploads/uploads.routes';
import usersRouter from '../modules/users/users.routes';
import teamRouter from '../modules/team/team.routes';
import testimonialsRouter from '../modules/testimonials/testimonials.routes';
import faqsRouter from '../modules/faqs/faqs.routes';
import pricingRouter from '../modules/pricing/pricing.routes';
import documentsRouter from '../modules/documents/documents.routes';
import notificationsRouter from '../modules/notifications/notifications.routes';
import tasksRouter from '../modules/tasks/tasks.routes';
import analyticsRouter from '../modules/analytics/analytics.routes';
import paymentsRouter from '../modules/payments/payments.routes';
import newsletterRouter from '../modules/newsletter/newsletter.routes';

const router = Router();

// ========== ROUTES PUBLIQUES ==========
router.use('/auth', authRouter);
router.use('/blog', blogRouter);
router.use('/portfolio', portfolioRouter);
router.use('/contacts', contactsRouter);
router.use('/team', teamRouter);
router.use('/testimonials', testimonialsRouter);
router.use('/faqs', faqsRouter);
router.use('/pricing', pricingRouter);

// ========== ROUTES PROTÉGÉES ==========
router.use('/users', usersRouter);
router.use('/projects', projectsRouter);
router.use('/quotes', quotesRouter);
router.use('/invoices', invoicesRouter);
router.use('/messages', messagesRouter);
router.use('/uploads', uploadsRouter);
router.use('/documents', documentsRouter);
router.use('/notifications', notificationsRouter);
router.use('/tasks', tasksRouter);
router.use('/analytics', analyticsRouter);
router.use('/payments', paymentsRouter);
router.use('/newsletter', newsletterRouter);

export default router;
