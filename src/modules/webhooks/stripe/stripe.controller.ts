import { Request, Response } from 'express';
import { processStripeWebhook } from './stripe.service';

export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'];
  const result = await processStripeWebhook(
    req.body as Buffer,
    typeof signature === 'string' ? signature : undefined,
  );
  return res.status(result.status).json(result.payload);
}
