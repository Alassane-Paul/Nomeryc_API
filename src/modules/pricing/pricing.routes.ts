import { Router } from 'express';
import {
  getPricingPlans,
  getPricingPlan,
  getAllPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} from './pricing.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const pricingRouter = Router();

pricingRouter.get('/', getPricingPlans);
pricingRouter.get('/admin/all', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getAllPricingPlans);
pricingRouter.get('/:id', getPricingPlan);
pricingRouter.post('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), createPricingPlan);
pricingRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updatePricingPlan);
pricingRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deletePricingPlan);

export default pricingRouter;
