"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFedapayWebhook = processFedapayWebhook;
const invoice_model_1 = require("../../../models/invoice.model");
const fedapay_service_1 = require("../../../services/fedapay.service");
const payments_service_1 = require("../../payments/payments.service");
const invoice_enum_1 = require("../../../enums/invoice.enum");
async function processFedapayWebhook(body, signature) {
    if (!signature) {
        return { status: 400, payload: { responseCode: '10', responseMessage: 'Signature FedaPay manquante' } };
    }
    let event;
    try {
        event = (0, fedapay_service_1.constructFedapayEvent)(body, signature);
    }
    catch (err) {
        console.error('[fedapay webhook] Signature invalide:', err?.message);
        return { status: 400, payload: { responseCode: '10', responseMessage: `Webhook invalide: ${err?.message}` } };
    }
    if (event.name === 'transaction.approved') {
        const transaction = event.entity || event.data?.object || event.data;
        const transactionId = String(transaction?.id ?? '');
        if (transactionId) {
            const invoice = await invoice_model_1.Invoice.findOne({ where: { fedapayTransactionId: transactionId } });
            if (invoice) {
                await (0, payments_service_1.markInvoicePaidFromWebhook)(invoice.id, invoice_enum_1.PaymentMethod.MOBILE_MONEY, { fedapayTransactionId: transactionId });
            }
            else {
                console.error(`[fedapay webhook] Aucune facture liée à la transaction ${transactionId}`);
            }
        }
    }
    return { status: 200, payload: { received: true } };
}
