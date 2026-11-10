"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStripePaymentService = initStripePaymentService;
const invoice_model_1 = require("../../../models/invoice.model");
const user_model_1 = require("../../../models/user.model");
const invoice_enum_1 = require("../../../enums/invoice.enum");
const user_enum_1 = require("../../../enums/user.enum");
const stripe_service_1 = require("../../../services/stripe.service");
async function initStripePaymentService(id, userId, role) {
    if (!(0, stripe_service_1.isStripeConfigured)())
        return 'unconfigured';
    const where = { id };
    if (role !== user_enum_1.UserRole.ADMIN)
        where.clientId = userId;
    const invoice = await invoice_model_1.Invoice.findOne({ where });
    if (!invoice)
        return 'not-found';
    if (invoice.status === invoice_enum_1.InvoiceStatus.PAYE)
        return 'paid';
    const client = await user_model_1.User.findByPk(invoice.clientId);
    if (!client)
        return 'client-not-found';
    const url = await (0, stripe_service_1.createStripeCheckoutSession)({
        invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, amountFcfa: invoice.totalTTC, clientEmail: client.email,
    });
    return { url };
}
