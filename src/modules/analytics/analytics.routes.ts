import { Router } from 'express';
import { getDashboardAnalytics, getPublicStats } from './analytics.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const analyticsRouter = Router();

// Public : chiffres clés réels affichés sur la page "À propos" du site vitrine.
analyticsRouter.get('/public-stats', getPublicStats);

analyticsRouter.use(authMiddleware, authorizationMiddleware([UserRole.ADMIN]));
analyticsRouter.get('/dashboard', getDashboardAnalytics);

export default analyticsRouter;
