import { Router } from 'express';
import { getPortfolioItems, getPortfolioItem, getAllPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from './portfolio.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const portfolioRouter = Router();

portfolioRouter.get('/', getPortfolioItems);
portfolioRouter.get('/admin/all', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getAllPortfolioItems);
portfolioRouter.get('/:id', getPortfolioItem);
portfolioRouter.post('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), createPortfolioItem);
portfolioRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updatePortfolioItem);
portfolioRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deletePortfolioItem);

export default portfolioRouter;
