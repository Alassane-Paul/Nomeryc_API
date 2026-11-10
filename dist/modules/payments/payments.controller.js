"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFedapayPayment = exports.initStripePayment = void 0;
const invoice_model_1 = require("../../models/invoice.model");
const user_model_1 = require("../../models/user.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_enum_1 = require("../../enums/user.enum");
const invoice_enum_1 = require("../../enums/invoice.enum");
const stripe_service_1 = require("../../services/stripe.service");
const fedapay_service_1 = require("../../services/fedapay.service");
async function findPayableInvoice(req, res) {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const invoice = await invoice_model_1.Invoice.findOne({ where });
    if (!invoice) {
        (0, response_1.sendError)(res, '30', 'Facture non trouvée');
        return null;
    }
    if (invoice.status === invoice_enum_1.InvoiceStatus.PAYE) {
        (0, response_1.sendError)(res, '12', 'Cette facture est déjà payée');
        return null;
    }
    return invoice;
}
// POST /api/v1/payments/stripe/:id
exports.initStripePayment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!(0, stripe_service_1.isStripeConfigured)())
        return (0, response_1.sendError)(res, '99', 'Le paiement par carte n\'est pas encore configuré.');
    const invoice = await findPayableInvoice(req, res);
    if (!invoice)
        return;
    const client = await user_model_1.User.findByPk(invoice.clientId);
    if (!client)
        return (0, response_1.sendError)(res, '30', 'Client introuvable');
    const url = await (0, stripe_service_1.createStripeCheckoutSession)({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amountFcfa: invoice.totalTTC,
        clientEmail: client.email,
    });
    return (0, response_1.sendResponse)(res, { data: { url } });
});
// POST /api/v1/payments/fedapay/:id  body: { phone? }
exports.initFedapayPayment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!(0, fedapay_service_1.isFedapayConfigured)())
        return (0, response_1.sendError)(res, '99', 'Le paiement Mobile Money n\'est pas encore configuré.');
    const invoice = await findPayableInvoice(req, res);
    if (!invoice)
        return;
    const client = await user_model_1.User.findByPk(invoice.clientId);
    if (!client)
        return (0, response_1.sendError)(res, '30', 'Client introuvable');
    try {
        const { transactionId, url } = await (0, fedapay_service_1.createFedapayTransaction)({
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            amountFcfa: invoice.totalTTC,
            client: { firstName: client.firstName, lastName: client.lastName, email: client.email, phone: req.body.phone || client.phone },
        });
        await invoice.update({ fedapayTransactionId: transactionId });
        return (0, response_1.sendResponse)(res, { data: { url } });
    }
    catch (err) {
        console.error('[fedapay] Erreur création transaction:', err?.message || err);
        return (0, response_1.sendError)(res, '99', 'Impossible de créer la transaction Mobile Money pour le moment.');
    }
});
