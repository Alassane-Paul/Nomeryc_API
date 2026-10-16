import { FedaPay, Transaction, Webhook } from 'fedapay';
import { env } from '../config/env';

let configured = false;

function ensureConfigured() {
  if (!env.FEDAPAY_SECRET_KEY) {
    throw new Error('FEDAPAY_SECRET_KEY manquant : configurez-le dans .env pour activer le paiement Mobile Money.');
  }
  if (!configured) {
    FedaPay.setApiKey(env.FEDAPAY_SECRET_KEY);
    FedaPay.setEnvironment(env.FEDAPAY_ENVIRONMENT); // 'sandbox' ou 'live'
    configured = true;
  }
}

export function isFedapayConfigured(): boolean {
  return Boolean(env.FEDAPAY_SECRET_KEY);
}

interface CreateTransactionParams {
  invoiceId: string;
  invoiceNumber: string;
  amountFcfa: number;
  client: { firstName: string; lastName: string; email: string; phone?: string };
}

/** Crée une transaction FedaPay et renvoie l'URL de paiement hébergée (redirection client). */
export async function createFedapayTransaction(params: CreateTransactionParams): Promise<{ transactionId: string; url: string }> {
  ensureConfigured();

  const transaction = await Transaction.create({
    description: `Facture ${params.invoiceNumber}`,
    amount: Math.round(params.amountFcfa),
    currency: { iso: 'XOF' },
    callback_url: `${env.FRONTEND_URL}/client/factures?payment=callback&invoice=${params.invoiceId}`,
    customer: {
      firstname: params.client.firstName,
      lastname: params.client.lastName,
      email: params.client.email,
      ...(params.client.phone ? { phone_number: { number: params.client.phone, country: 'tg' } } : {}),
    },
  });

  const token = await transaction.generateToken();

  return { transactionId: String((transaction as any).id), url: (token as any).url };
}

/** Vérifie la signature du webhook (en-tête X-FEDAPAY-SIGNATURE) et retourne l'évènement. */
export function constructFedapayEvent(rawBody: Buffer | string, signature: string): any {
  if (!env.FEDAPAY_WEBHOOK_SECRET) {
    throw new Error('FEDAPAY_WEBHOOK_SECRET manquant : impossible de vérifier la signature du webhook.');
  }
  return Webhook.constructEvent(rawBody, signature, env.FEDAPAY_WEBHOOK_SECRET);
}
