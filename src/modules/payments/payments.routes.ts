import { Router } from 'express';
import { initStripePayment } from './stripe/stripe.controller';
import { initFedapayPayment } from './fedapay/fedapay.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const paymentsRouter = Router();
paymentsRouter.use(authMiddleware);

paymentsRouter.post('/stripe/:id', initStripePayment);
paymentsRouter.post('/fedapay/:id', initFedapayPayment);

export default paymentsRouter;
