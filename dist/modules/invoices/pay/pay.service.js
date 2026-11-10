"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markInvoicePaidService = markInvoicePaidService;
const invoice_model_1 = require("../../../models/invoice.model");
const user_model_1 = require("../../../models/user.model");
const invoice_enum_1 = require("../../../enums/invoice.enum");
const user_enum_1 = require("../../../enums/user.enum");
const mail_service_1 = require("../../../services/mail.service");
const notification_service_1 = require("../../../services/notification.service");
const user_enum_2 = require("../../../enums/user.enum");
async function markInvoicePaidService(id, userId, role, body) {
    const where = { id };
    const isAdmin = role === user_enum_2.UserRole.ADMIN;
    if (!isAdmin)
        where.clientId = userId;
    const invoice = await invoice_model_1.Invoice.findOne({ where });
    if (!invoice)
        return { invoice: null };
    await invoice.update({
        status: invoice_enum_1.InvoiceStatus.PAYE, paidAt: new Date(), paymentMethod: body.paymentMethod,
        stripePaymentIntentId: body.stripePaymentIntentId,
    });
    const client = await user_model_1.User.findByPk(invoice.clientId);
    if (client) {
        const mail = mail_service_1.mailTemplates.invoicePaid(client.firstName, invoice.invoiceNumber, invoice.totalTTC);
        (0, mail_service_1.sendMail)({ to: client.email, ...mail });
    }
    if (!isAdmin) {
        const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id'] });
        admins.forEach((admin) => (0, notification_service_1.notify)({
            userId: admin.id, title: 'Paiement reçu',
            message: `Facture ${invoice.invoiceNumber} marquée comme payée`,
            type: 'INVOICE', link: '/admin/factures',
        }));
    }
    return { invoice };
}
