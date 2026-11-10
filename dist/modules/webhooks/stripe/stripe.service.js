"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processStripeWebhook = processStripeWebhook;
const stripe_service_1 = require("../../../services/stripe.service");
const payments_service_1 = require("../../payments/payments.service");
const invoice_enum_1 = require("../../../enums/invoice.enum");
async function processStripeWebhook(body, signature) {
    if (!signature) {
        return { status: 400, payload: { responseCode: '10', responseMessage: 'Signature Stripe manquante' } };
    }
    let event;
    try {
        event = (0, stripe_service_1.constructStripeEvent)(body, signature);
    }
    catch (err) {
        console.error('[stripe webhook] Signature invalide:', err?.message);
        return { status: 400, payload: { responseCode: '10', responseMessage: `Webhook invalide: ${err?.message}` } };
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const invoiceId = session.metadata?.invoiceId;
        if (invoiceId) {
            await (0, payments_service_1.markInvoicePaidFromWebhook)(invoiceId, invoice_enum_1.PaymentMethod.CARTE, {
                stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
            });
        }
    }
    return { status: 200, payload: { received: true } };
}
