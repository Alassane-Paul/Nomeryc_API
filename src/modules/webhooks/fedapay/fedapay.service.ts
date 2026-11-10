import { Invoice } from '../../../models/invoice.model';
import { constructFedapayEvent } from '../../../services/fedapay.service';
import { markInvoicePaidFromWebhook } from '../../payments/payments.service';
import { PaymentMethod } from '../../../enums/invoice.enum';

export async function processFedapayWebhook(body: Buffer, signature: string | undefined) {
  if (!signature) {
    return { status: 400, payload: { responseCode: '10', responseMessage: 'Signature FedaPay manquante' } };
  }

  let event: any;
  try {
    event = constructFedapayEvent(body, signature);
  } catch (err: any) {
    console.error('[fedapay webhook] Signature invalide:', err?.message);
    return { status: 400, payload: { responseCode: '10', responseMessage: `Webhook invalide: ${err?.message}` } };
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
  return { status: 200, payload: { received: true } };
}
