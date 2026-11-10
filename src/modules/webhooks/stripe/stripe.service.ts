import { constructStripeEvent } from '../../../services/stripe.service';
import { markInvoicePaidFromWebhook } from '../../payments/payments.service';
import { PaymentMethod } from '../../../enums/invoice.enum';

export async function processStripeWebhook(body: Buffer, signature: string | undefined) {
  if (!signature) {
    return { status: 400, payload: { responseCode: '10', responseMessage: 'Signature Stripe manquante' } };
  }

  let event;
  try {
    event = constructStripeEvent(body, signature);
  } catch (err: any) {
    console.error('[stripe webhook] Signature invalide:', err?.message);
    return { status: 400, payload: { responseCode: '10', responseMessage: `Webhook invalide: ${err?.message}` } };
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

  return { status: 200, payload: { received: true } };
}
