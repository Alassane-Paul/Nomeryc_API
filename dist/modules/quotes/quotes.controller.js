"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotePdf = exports.deleteQuote = exports.updateQuote = exports.updateQuoteStatus = exports.createQuote = exports.getQuote = exports.getQuotes = void 0;
const quote_model_1 = require("../../models/quote.model");
const quote_model_2 = require("../../models/quote.model");
const user_model_1 = require("../../models/user.model");
const project_model_1 = require("../../models/project.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_enum_1 = require("../../enums/user.enum");
const quote_enum_1 = require("../../enums/quote.enum");
const mail_service_1 = require("../../services/mail.service");
const notification_service_1 = require("../../services/notification.service");
const pdf_service_1 = require("../../services/pdf.service");
const zod_1 = require("zod");
const quoteItemSchema = zod_1.z.object({
    designation: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    quantity: zod_1.z.number().positive(),
    unitPrice: zod_1.z.number().min(0),
    unit: zod_1.z.string().optional(),
});
const quoteSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid().optional(),
    projectId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().optional(),
    tvaRate: zod_1.z.number().min(0).max(100).default(18),
    validUntil: zod_1.z.string().optional(),
    terms: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    items: zod_1.z.array(quoteItemSchema).min(1),
});
function calculateQuoteTotals(items, tvaRate) {
    const totalHT = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const totalTVA = totalHT * (tvaRate / 100);
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
}
function generateQuoteNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `DEV-${year}${month}-${rand}`;
}
// GET /api/v1/quotes
exports.getQuotes = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const where = isAdmin ? {} : { clientId: req.user?.id };
    const quotes = await quote_model_1.Quote.findAll({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
            { model: quote_model_2.QuoteItem, as: 'items' },
        ],
        order: [['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: quotes });
});
// GET /api/v1/quotes/:id
exports.getQuote = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const quote = await quote_model_1.Quote.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'company', 'phone'] },
            { model: project_model_1.Project, as: 'project' },
            { model: quote_model_2.QuoteItem, as: 'items' },
        ],
    });
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    return (0, response_1.sendResponse)(res, { data: quote });
});
// POST /api/v1/quotes (Admin only)
exports.createQuote = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = quoteSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const { items, tvaRate, validUntil, ...quoteData } = parsed.data;
    const totals = calculateQuoteTotals(items, tvaRate);
    const quote = await quote_model_1.Quote.create({
        ...quoteData,
        clientId: quoteData.clientId || req.user.id,
        quoteNumber: generateQuoteNumber(),
        tvaRate,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        ...totals,
        status: quote_enum_1.QuoteStatus.BROUILLON,
    });
    // Créer les lignes du devis
    await quote_model_2.QuoteItem.bulkCreate(items.map(item => ({
        quoteId: quote.id,
        ...item,
        total: item.quantity * item.unitPrice,
    })));
    const fullQuote = await quote_model_1.Quote.findByPk(quote.id, {
        include: [{ model: quote_model_2.QuoteItem, as: 'items' }],
    });
    // Le devis reste en BROUILLON : on ne notifie le client qu'à l'envoi (updateQuoteStatus → ENVOYE).
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: fullQuote });
});
// PATCH /api/v1/quotes/:id/status (Client: accept/reject, Admin: any)
exports.updateQuoteStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const quote = await quote_model_1.Quote.findOne({ where });
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    const { status } = req.body;
    if (!Object.values(quote_enum_1.QuoteStatus).includes(status)) {
        return (0, response_1.sendError)(res, '10', 'Statut invalide');
    }
    // Le client ne peut qu'accepter ou refuser
    if (!isAdmin && ![quote_enum_1.QuoteStatus.ACCEPTE, quote_enum_1.QuoteStatus.REFUSE].includes(status)) {
        return (0, response_1.sendError)(res, '23', 'Action non autorisée');
    }
    await quote.update({ status });
    // Le client est prévenu quand le devis lui est envoyé.
    if (isAdmin && status === quote_enum_1.QuoteStatus.ENVOYE) {
        const client = await user_model_1.User.findByPk(quote.clientId);
        if (client) {
            const mail = mail_service_1.mailTemplates.quoteSent(client.firstName, quote.quoteNumber, quote.totalTTC);
            (0, mail_service_1.sendMail)({ to: client.email, ...mail });
            (0, notification_service_1.notify)({
                userId: client.id,
                title: 'Nouveau devis disponible',
                message: `Devis ${quote.quoteNumber} — ${quote.totalTTC.toLocaleString('fr-FR')} FCFA`,
                type: 'QUOTE',
                link: '/client/devis',
            });
        }
    }
    // L'admin est prévenu quand un client accepte/refuse.
    if (!isAdmin) {
        const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id'] });
        const label = status === quote_enum_1.QuoteStatus.ACCEPTE ? 'accepté' : 'refusé';
        admins.forEach((admin) => (0, notification_service_1.notify)({
            userId: admin.id,
            title: `Devis ${label}`,
            message: `Le devis ${quote.quoteNumber} a été ${label} par le client`,
            type: 'QUOTE',
            link: '/admin/devis',
        }));
    }
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: quote });
});
// PATCH /api/v1/quotes/:id (Admin: update full quote)
exports.updateQuote = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const quote = await quote_model_1.Quote.findByPk(String(req.params.id));
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    if (req.body.items) {
        const tvaRate = req.body.tvaRate || quote.tvaRate;
        const { totalHT, totalTVA, totalTTC } = calculateQuoteTotals(req.body.items, tvaRate);
        await quote_model_2.QuoteItem.destroy({ where: { quoteId: quote.id } });
        await quote_model_2.QuoteItem.bulkCreate(req.body.items.map((item) => ({
            quoteId: quote.id,
            ...item,
            total: item.quantity * item.unitPrice,
        })));
        await quote.update({ ...req.body, totalHT, totalTVA, totalTTC });
    }
    else {
        await quote.update(req.body);
    }
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: quote });
});
// DELETE /api/v1/quotes/:id
exports.deleteQuote = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const quote = await quote_model_1.Quote.findByPk(String(req.params.id));
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    await quote.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
// GET /api/v1/quotes/:id/pdf
exports.getQuotePdf = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const quote = await quote_model_1.Quote.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
            { model: quote_model_2.QuoteItem, as: 'items' },
        ],
    });
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    (0, pdf_service_1.streamDocumentPdf)(res, {
        kind: 'Devis',
        number: quote.quoteNumber,
        date: quote.createdAt,
        validUntilOrDueDate: quote.validUntil,
        validUntilOrDueLabel: 'Valable jusqu\'au',
        status: quote.status,
        client: quote.client,
        items: quote.items,
        totalHT: quote.totalHT,
        totalTVA: quote.totalTVA,
        tvaRate: quote.tvaRate,
        totalTTC: quote.totalTTC,
        notes: quote.notes,
        terms: quote.terms,
    });
});
