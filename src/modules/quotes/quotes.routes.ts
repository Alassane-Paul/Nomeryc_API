import { Router } from 'express';
import { getQuotes, getQuote, createQuote, updateQuote, updateQuoteStatus, deleteQuote, getQuotePdf } from './quotes.controller';
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
