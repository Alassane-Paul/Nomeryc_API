"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoicePdf = exports.deleteInvoice = exports.markAsPaid = exports.updateInvoice = exports.createInvoice = exports.getInvoice = exports.getInvoices = void 0;
const invoice_model_1 = require("../../models/invoice.model");
const user_model_1 = require("../../models/user.model");
const project_model_1 = require("../../models/project.model");
const quote_model_1 = require("../../models/quote.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_enum_1 = require("../../enums/user.enum");
const invoice_enum_1 = require("../../enums/invoice.enum");
const user_enum_2 = require("../../enums/user.enum");
const mail_service_1 = require("../../services/mail.service");
const notification_service_1 = require("../../services/notification.service");
const pdf_service_1 = require("../../services/pdf.service");
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `FAC-${year}${month}-${rand}`;
}
exports.getInvoices = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const where = isAdmin ? {} : { clientId: req.user?.id };
    const invoices = await invoice_model_1.Invoice.findAll({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
        ],
        order: [['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: invoices });
});
exports.getInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const invoice = await invoice_model_1.Invoice.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'company', 'phone'] },
            { model: project_model_1.Project, as: 'project' },
            { model: quote_model_1.Quote, as: 'quote' },
            { model: invoice_model_1.InvoiceItem, as: 'items' },
        ],
    });
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    return (0, response_1.sendResponse)(res, { data: invoice });
});
exports.createInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { clientId, projectId, quoteId, items, tvaRate = 18, dueDate, ...rest } = req.body;
    const totalHT = (items || []).reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const totalTVA = totalHT * (tvaRate / 100);
    const totalTTC = totalHT + totalTVA;
    const invoice = await invoice_model_1.Invoice.create({
        ...rest,
        clientId,
        projectId,
        quoteId,
        invoiceNumber: generateInvoiceNumber(),
        tvaRate,
        totalHT,
        totalTVA,
        totalTTC,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: invoice_enum_1.InvoiceStatus.BROUILLON,
    });
    if (items?.length) {
        await invoice_model_1.InvoiceItem.bulkCreate(items.map((item) => ({
            invoiceId: invoice.id,
            ...item,
            total: item.quantity * item.unitPrice,
        })));
    }
    const fullInvoice = await invoice_model_1.Invoice.findByPk(invoice.id, {
        include: [{ model: invoice_model_1.InvoiceItem, as: 'items' }],
    });
    const client = await user_model_1.User.findByPk(clientId);
    if (client) {
        const mail = mail_service_1.mailTemplates.invoiceSent(client.firstName, invoice.invoiceNumber, invoice.totalTTC, invoice.dueDate);
        (0, mail_service_1.sendMail)({ to: client.email, ...mail });
        (0, notification_service_1.notify)({
            userId: client.id,
            title: 'Nouvelle facture',
            message: `Facture ${invoice.invoiceNumber} — ${invoice.totalTTC.toLocaleString('fr-FR')} FCFA`,
            type: 'INVOICE',
            link: '/client/factures',
        });
    }
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: fullInvoice });
});
exports.updateInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const invoice = await invoice_model_1.Invoice.findByPk(String(req.params.id));
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    await invoice.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: invoice });
});
exports.markAsPaid = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const invoice = await invoice_model_1.Invoice.findOne({ where });
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    await invoice.update({
        status: invoice_enum_1.InvoiceStatus.PAYE,
        paidAt: new Date(),
        paymentMethod: req.body.paymentMethod,
        stripePaymentIntentId: req.body.stripePaymentIntentId,
    });
    const client = await user_model_1.User.findByPk(invoice.clientId);
    if (client) {
        const mail = mail_service_1.mailTemplates.invoicePaid(client.firstName, invoice.invoiceNumber, invoice.totalTTC);
        (0, mail_service_1.sendMail)({ to: client.email, ...mail });
    }
    if (!isAdmin) {
        const admins = await user_model_1.User.findAll({ where: { role: user_enum_2.UserRole.ADMIN }, attributes: ['id'] });
        admins.forEach((admin) => (0, notification_service_1.notify)({
            userId: admin.id,
            title: 'Paiement reçu',
            message: `Facture ${invoice.invoiceNumber} marquée comme payée`,
            type: 'INVOICE',
            link: '/admin/factures',
        }));
    }
    return (0, response_1.sendResponse)(res, { responseCode: '02', responseMessage: 'Facture marquée comme payée', data: invoice });
});
exports.deleteInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const invoice = await invoice_model_1.Invoice.findByPk(String(req.params.id));
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    await invoice.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
// GET /api/v1/invoices/:id/pdf
exports.getInvoicePdf = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const invoice = await invoice_model_1.Invoice.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
            { model: invoice_model_1.InvoiceItem, as: 'items' },
        ],
    });
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    (0, pdf_service_1.streamDocumentPdf)(res, {
        kind: 'Facture',
        number: invoice.invoiceNumber,
        date: invoice.createdAt,
        validUntilOrDueDate: invoice.dueDate,
        validUntilOrDueLabel: 'Échéance',
        status: invoice.status,
        client: invoice.client,
        items: invoice.items,
        totalHT: invoice.totalHT,
        totalTVA: invoice.totalTVA,
        tvaRate: invoice.tvaRate,
        totalTTC: invoice.totalTTC,
        notes: invoice.notes,
    });
});
