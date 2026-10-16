import Stripe from 'stripe';
import { env } from '../config/env';

let stripeClient: Stripe | null = null;

/** Instance paresseuse : évite un crash au démarrage si la clé n'est pas encore configurée. */
function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY manquant : configurez-le dans .env pour activer le paiement par carte.');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}

interface CreateCheckoutParams {
  invoiceId: string;
  invoiceNumber: string;
  amountFcfa: number; // XOF est une devise "zero-decimal" chez Stripe : le montant s'envoie tel quel, sans multiplier par 100.
  clientEmail: string;
}

/** Crée une session Stripe Checkout et renvoie l'URL de paiement hébergée par Stripe. */
export async function createStripeCheckoutSession(params: CreateCheckoutParams): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: params.clientEmail,
    line_items: [
      {
        price_data: {
          currency: 'xof',
          unit_amount: Math.round(params.amountFcfa), // zero-decimal : pas de conversion en centimes
          product_data: { name: `Facture ${params.invoiceNumber}` },
        },
        quantity: 1,
      },
    ],
    metadata: { invoiceId: params.invoiceId, invoiceNumber: params.invoiceNumber },
    success_url: `${env.FRONTEND_URL}/client/factures?payment=success&invoice=${params.invoiceId}`,
    cancel_url: `${env.FRONTEND_URL}/client/factures?payment=cancelled&invoice=${params.invoiceId}`,
  });

  if (!session.url) throw new Error('Stripe n\'a pas renvoyé d\'URL de paiement.');
  return session.url;
}

/** Vérifie la signature du webhook et retourne l'évènement Stripe parsé. */
export function constructStripeEvent(rawBody: Buffer, signature: string): Stripe.Event {
  const stripe = getStripe();
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET manquant : impossible de vérifier la signature du webhook.');
  }
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
}
