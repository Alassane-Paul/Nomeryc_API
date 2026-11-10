"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteSchema = void 0;
exports.createQuote = createQuote;
const zod_1 = require("zod");
const quote_model_1 = require("../../../models/quote.model");
const quote_enum_1 = require("../../../enums/quote.enum");
const quoteItemSchema = zod_1.z.object({
    designation: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    quantity: zod_1.z.number().positive(),
    unitPrice: zod_1.z.number().min(0),
    unit: zod_1.z.string().optional(),
});
exports.quoteSchema = zod_1.z.object({
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
async function createQuote(data, userId) {
    const { items, tvaRate, validUntil, ...quoteData } = data;
    const totals = calculateQuoteTotals(items, tvaRate);
    const quote = await quote_model_1.Quote.create({
        ...quoteData,
        clientId: quoteData.clientId || userId,
        quoteNumber: generateQuoteNumber(),
        tvaRate,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        ...totals,
        status: quote_enum_1.QuoteStatus.BROUILLON,
    });
    await quote_model_1.QuoteItem.bulkCreate(items.map(item => ({
        quoteId: quote.id,
        ...item,
        total: item.quantity * item.unitPrice,
    })));
    return quote_model_1.Quote.findByPk(quote.id, { include: [{ model: quote_model_1.QuoteItem, as: 'items' }] });
}
