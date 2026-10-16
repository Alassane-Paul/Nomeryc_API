import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { subscribe, unsubscribe } from './newsletter.controller';

const newsletterRouter = Router();

const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { responseCode: '98', responseMessage: 'Trop de tentatives, réessayez plus tard.' },
});

newsletterRouter.post('/subscribe', newsletterLimiter, subscribe);
newsletterRouter.post('/unsubscribe', unsubscribe);

export default newsletterRouter;
