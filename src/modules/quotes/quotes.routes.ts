import { Router } from 'express';
import { getQuotes } from './list/list.controller';
import { getQuote } from './get/get.controller';
import { createQuote } from './create/create.controller';
import { updateQuote } from './update/update.controller';
import { updateQuoteStatus } from './update-status/update-status.controller';
import { deleteQuote } from './delete/delete.controller';
import { getQuotePdf } from './get-pdf/get-pdf.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const quotesRouter = Router();
quotesRouter.use(authMiddleware);

quotesRouter.get('/', getQuotes);
quotesRouter.get('/:id', getQuote);
quotesRouter.get('/:id/pdf', getQuotePdf);
quotesRouter.post('/', authorizationMiddleware([UserRole.ADMIN]), createQuote);
quotesRouter.patch('/:id', authorizationMiddleware([UserRole.ADMIN]), updateQuote);
quotesRouter.patch('/:id/status', updateQuoteStatus);
quotesRouter.delete('/:id', authorizationMiddleware([UserRole.ADMIN]), deleteQuote);

export default quotesRouter;
