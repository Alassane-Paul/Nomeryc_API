"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFedapayConfigured = isFedapayConfigured;
exports.createFedapayTransaction = createFedapayTransaction;
exports.constructFedapayEvent = constructFedapayEvent;
const fedapay_1 = require("fedapay");
const env_1 = require("../config/env");
let configured = false;
function ensureConfigured() {
    if (!env_1.env.FEDAPAY_SECRET_KEY) {
        throw new Error('FEDAPAY_SECRET_KEY manquant : configurez-le dans .env pour activer le paiement Mobile Money.');
    }
    if (!configured) {
        fedapay_1.FedaPay.setApiKey(env_1.env.FEDAPAY_SECRET_KEY);
        fedapay_1.FedaPay.setEnvironment(env_1.env.FEDAPAY_ENVIRONMENT); // 'sandbox' ou 'live'
        configured = true;
    }
}
function isFedapayConfigured() {
    return Boolean(env_1.env.FEDAPAY_SECRET_KEY);
}
/** Crée une transaction FedaPay et renvoie l'URL de paiement hébergée (redirection client). */
async function createFedapayTransaction(params) {
    ensureConfigured();
    const transaction = await fedapay_1.Transaction.create({
        description: `Facture ${params.invoiceNumber}`,
        amount: Math.round(params.amountFcfa),
        currency: { iso: 'XOF' },
        callback_url: `${env_1.env.FRONTEND_URL}/client/factures?payment=callback&invoice=${params.invoiceId}`,
        customer: {
            firstname: params.client.firstName,
            lastname: params.client.lastName,
            email: params.client.email,
            ...(params.client.phone ? { phone_number: { number: params.client.phone, country: 'tg' } } : {}),
        },
    });
    const token = await transaction.generateToken();
    return { transactionId: String(transaction.id), url: token.url };
}
/** Vérifie la signature du webhook (en-tête X-FEDAPAY-SIGNATURE) et retourne l'évènement. */
function constructFedapayEvent(rawBody, signature) {
    if (!env_1.env.FEDAPAY_WEBHOOK_SECRET) {
        throw new Error('FEDAPAY_WEBHOOK_SECRET manquant : impossible de vérifier la signature du webhook.');
    }
    return fedapay_1.Webhook.constructEvent(rawBody, signature, env_1.env.FEDAPAY_WEBHOOK_SECRET);
}
