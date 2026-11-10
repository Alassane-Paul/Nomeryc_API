import { Request, Response } from 'express';
import { processFedapayWebhook } from './fedapay.service';

export async function fedapayWebhook(req: Request, res: Response) {
  const signature = req.headers['x-fedapay-signature'];
  const result = await processFedapayWebhook(
    req.body as Buffer,
    typeof signature === 'string' ? signature : undefined,
  );
  return res.status(result.status).json(result.payload);
}
