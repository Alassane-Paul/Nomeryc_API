"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoiceService = createInvoiceService;
const invoice_model_1 = require("../../../models/invoice.model");
const user_model_1 = require("../../../models/user.model");
const invoice_enum_1 = require("../../../enums/invoice.enum");
const mail_service_1 = require("../../../services/mail.service");
const notification_service_1 = require("../../../services/notification.service");
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `FAC-${year}${month}-${rand}`;
}
async function createInvoiceService(body) {
    const { clientId, projectId, quoteId, items, tvaRate = 18, dueDate, ...rest } = body;
    const totalHT = (items || []).reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const totalTVA = totalHT * (tvaRate / 100);
    const totalTTC = totalHT + totalTVA;
    const invoice = await invoice_model_1.Invoice.create({
        ...rest, clientId, projectId, quoteId, invoiceNumber: generateInvoiceNumber(), tvaRate,
        totalHT, totalTVA, totalTTC, dueDate: dueDate ? new Date(dueDate) : undefined, status: invoice_enum_1.InvoiceStatus.BROUILLON,
    });
    if (items?.length) {
        await invoice_model_1.InvoiceItem.bulkCreate(items.map((item) => ({
            invoiceId: invoice.id, ...item, total: item.quantity * item.unitPrice,
        })));
    }
    const fullInvoice = await invoice_model_1.Invoice.findByPk(invoice.id, { include: [{ model: invoice_model_1.InvoiceItem, as: 'items' }] });
    const client = await user_model_1.User.findByPk(clientId);
    if (client) {
        const mail = mail_service_1.mailTemplates.invoiceSent(client.firstName, invoice.invoiceNumber, invoice.totalTTC, invoice.dueDate);
        (0, mail_service_1.sendMail)({ to: client.email, ...mail });
        (0, notification_service_1.notify)({
            userId: client.id, title: 'Nouvelle facture',
            message: `Facture ${invoice.invoiceNumber} — ${invoice.totalTTC.toLocaleString('fr-FR')} FCFA`,
            type: 'INVOICE', link: '/client/factures',
        });
    }
    return fullInvoice;
}
