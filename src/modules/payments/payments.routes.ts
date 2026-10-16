import { Router } from 'express';
import { initStripePayment, initFedapayPayment } from './payments.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const paymentsRouter = Router();
paymentsRouter.use(authMiddleware);

paymentsRouter.post('/stripe/:id', initStripePayment);
paymentsRouter.post('/fedapay/:id', initFedapayPayment);

export default paymentsRouter;
