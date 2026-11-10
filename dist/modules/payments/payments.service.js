"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markInvoicePaidFromWebhook = markInvoicePaidFromWebhook;
const invoice_model_1 = require("../../models/invoice.model");
const user_model_1 = require("../../models/user.model");
const invoice_enum_1 = require("../../enums/invoice.enum");
const mail_service_1 = require("../../services/mail.service");
const notification_service_1 = require("../../services/notification.service");
const socket_1 = require("../../config/socket");
const user_enum_1 = require("../../enums/user.enum");
/**
 * Marque une facture comme payée et déclenche les mêmes effets de bord que
 * le paiement manuel admin (email, notification, temps réel) — appelée à la
 * fois par le webhook Stripe et le webhook FedaPay pour ne pas dupliquer la logique.
 */
async function markInvoicePaidFromWebhook(invoiceId, paymentMethod, externalId) {
    const invoice = await invoice_model_1.Invoice.findByPk(invoiceId);
    if (!invoice) {
        console.error(`[payments] Webhook reçu pour une facture introuvable : ${invoiceId}`);
        return;
    }
    if (invoice.status === invoice_enum_1.InvoiceStatus.PAYE) {
        return; // idempotence : déjà traité (webhooks peuvent être renvoyés plusieurs fois)
    }
    await invoice.update({
        status: invoice_enum_1.InvoiceStatus.PAYE,
        paidAt: new Date(),
        paymentMethod,
        ...(externalId?.stripePaymentIntentId ? { stripePaymentIntentId: externalId.stripePaymentIntentId } : {}),
        ...(externalId?.fedapayTransactionId ? { fedapayTransactionId: externalId.fedapayTransactionId } : {}),
    });
    const client = await user_model_1.User.findByPk(invoice.clientId);
    if (client) {
        const mail = mail_service_1.mailTemplates.invoicePaid(client.firstName, invoice.invoiceNumber, invoice.totalTTC);
        (0, mail_service_1.sendMail)({ to: client.email, ...mail });
        (0, socket_1.emitToUser)(client.id, 'invoice:paid', { id: invoice.id, invoiceNumber: invoice.invoiceNumber });
    }
    const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id'] });
    admins.forEach((admin) => (0, notification_service_1.notify)({
        userId: admin.id,
        title: 'Paiement reçu',
        message: `Facture ${invoice.invoiceNumber} payée via ${paymentMethod}`,
        type: 'INVOICE',
        link: '/admin/factures',
    }));
    (0, socket_1.emitToAdmins)('invoice:paid', { id: invoice.id, invoiceNumber: invoice.invoiceNumber });
}
