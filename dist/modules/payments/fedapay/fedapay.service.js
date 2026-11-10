"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFedapayPaymentService = initFedapayPaymentService;
const invoice_model_1 = require("../../../models/invoice.model");
const user_model_1 = require("../../../models/user.model");
const invoice_enum_1 = require("../../../enums/invoice.enum");
const user_enum_1 = require("../../../enums/user.enum");
const fedapay_service_1 = require("../../../services/fedapay.service");
async function initFedapayPaymentService(id, userId, role, body) {
    if (!(0, fedapay_service_1.isFedapayConfigured)())
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
    try {
        const { transactionId, url } = await (0, fedapay_service_1.createFedapayTransaction)({
            invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, amountFcfa: invoice.totalTTC,
            client: { firstName: client.firstName, lastName: client.lastName, email: client.email, phone: body?.phone || client.phone },
        });
        await invoice.update({ fedapayTransactionId: transactionId });
        return { url };
    }
    catch (err) {
        console.error('[fedapay] Erreur création transaction:', err?.message || err);
        return 'transaction-error';
    }
}
