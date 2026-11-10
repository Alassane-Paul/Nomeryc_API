import { Router } from 'express';
import { getPortfolioItems } from './list/list.controller';
import { getPortfolioItem } from './get/get.controller';
import { getAllPortfolioItems } from './admin-list/admin-list.controller';
import { createPortfolioItem } from './create/create.controller';
import { updatePortfolioItem } from './update/update.controller';
import { deletePortfolioItem } from './delete/delete.controller';
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
