import { Router } from 'express';
import {
  getPricingPlans,
} from './list/list.controller';
import { getPricingPlan } from './get/get.controller';
import { getAllPricingPlans } from './list-all/list-all.controller';
import { createPricingPlan } from './create/create.controller';
import { updatePricingPlan } from './update/update.controller';
import { deletePricingPlan } from './delete/delete.controller';
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
