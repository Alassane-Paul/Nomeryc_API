import { Request, Response } from 'express';
import { Invoice } from '../../models/invoice.model';
import { constructStripeEvent } from '../../services/stripe.service';
import { constructFedapayEvent } from '../../services/fedapay.service';
import { markInvoicePaidFromWebhook } from '../payments/payments.service';
import { PaymentMethod } from '../../enums/invoice.enum';

// POST /api/v1/webhooks/stripe (monté avec express.raw AVANT le json parser global)
export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ responseCode: '10', responseMessage: 'Signature Stripe manquante' });
  }

  let event;
  try {
    event = constructStripeEvent(req.body as Buffer, signature);
  } catch (err: any) {
    console.error('[stripe webhook] Signature invalide:', err?.message);
    return res.status(400).json({ responseCode: '10', responseMessage: `Webhook invalide: ${err?.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const invoiceId = session.metadata?.invoiceId;
    if (invoiceId) {
      await markInvoicePaidFromWebhook(invoiceId, PaymentMethod.CARTE, {
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      });
    }
  }

  return res.status(200).json({ received: true });
}

// POST /api/v1/webhooks/fedapay (monté avec express.raw AVANT le json parser global)
export async function fedapayWebhook(req: Request, res: Response) {
  const signature = req.headers['x-fedapay-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ responseCode: '10', responseMessage: 'Signature FedaPay manquante' });
  }

  let event: any;
  try {
    event = constructFedapayEvent(req.body as Buffer, signature);
  } catch (err: any) {
    console.error('[fedapay webhook] Signature invalide:', err?.message);
    return res.status(400).json({ responseCode: '10', responseMessage: `Webhook invalide: ${err?.message}` });
  }

  if (event.name === 'transaction.approved') {
    const transaction = event.entity || event.data?.object || event.data;
    const transactionId = String(transaction?.id ?? '');

    if (transactionId) {
      const invoice = await Invoice.findOne({ where: { fedapayTransactionId: transactionId } });
      if (invoice) {
        await markInvoicePaidFromWebhook(invoice.id, PaymentMethod.MOBILE_MONEY, { fedapayTransactionId: transactionId });
      } else {
        console.error(`[fedapay webhook] Aucune facture liée à la transaction ${transactionId}`);
      }
    }
  }

  return res.status(200).json({ received: true });
}
