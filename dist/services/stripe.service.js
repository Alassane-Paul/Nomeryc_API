"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStripeConfigured = isStripeConfigured;
exports.createStripeCheckoutSession = createStripeCheckoutSession;
exports.constructStripeEvent = constructStripeEvent;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../config/env");
let stripeClient = null;
/** Instance paresseuse : évite un crash au démarrage si la clé n'est pas encore configurée. */
function getStripe() {
    if (!env_1.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY manquant : configurez-le dans .env pour activer le paiement par carte.');
    }
    if (!stripeClient) {
        stripeClient = new stripe_1.default(env_1.env.STRIPE_SECRET_KEY);
    }
    return stripeClient;
}
function isStripeConfigured() {
    return Boolean(env_1.env.STRIPE_SECRET_KEY);
}
/** Crée une session Stripe Checkout et renvoie l'URL de paiement hébergée par Stripe. */
async function createStripeCheckoutSession(params) {
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
        success_url: `${env_1.env.FRONTEND_URL}/client/factures?payment=success&invoice=${params.invoiceId}`,
        cancel_url: `${env_1.env.FRONTEND_URL}/client/factures?payment=cancelled&invoice=${params.invoiceId}`,
    });
    if (!session.url)
        throw new Error('Stripe n\'a pas renvoyé d\'URL de paiement.');
    return session.url;
}
/** Vérifie la signature du webhook et retourne l'évènement Stripe parsé. */
function constructStripeEvent(rawBody, signature) {
    const stripe = getStripe();
    if (!env_1.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET manquant : impossible de vérifier la signature du webhook.');
    }
    return stripe.webhooks.constructEvent(rawBody, signature, env_1.env.STRIPE_WEBHOOK_SECRET);
}
