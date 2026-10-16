import { Router } from 'express';
import { getInvoices, getInvoice, createInvoice, updateInvoice, markAsPaid, deleteInvoice, getInvoicePdf } from './invoices.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const invoicesRouter = Router();
invoicesRouter.use(authMiddleware);

invoicesRouter.get('/', getInvoices);
invoicesRouter.get('/:id', getInvoice);
invoicesRouter.get('/:id/pdf', getInvoicePdf);
invoicesRouter.post('/', authorizationMiddleware([UserRole.ADMIN]), createInvoice);
invoicesRouter.patch('/:id', authorizationMiddleware([UserRole.ADMIN]), updateInvoice);
invoicesRouter.post('/:id/pay', markAsPaid);
invoicesRouter.delete('/:id', authorizationMiddleware([UserRole.ADMIN]), deleteInvoice);

export default invoicesRouter;
