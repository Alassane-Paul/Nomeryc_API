"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuote = updateQuote;
const quote_model_1 = require("../../../models/quote.model");
function calculateQuoteTotals(items, tvaRate) {
    const totalHT = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const totalTVA = totalHT * (tvaRate / 100);
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
}
async function updateQuote(id, data) {
    const quote = await quote_model_1.Quote.findByPk(id);
    if (!quote)
        return null;
    if (data.items) {
        const tvaRate = data.tvaRate || quote.tvaRate;
        const { totalHT, totalTVA, totalTTC } = calculateQuoteTotals(data.items, tvaRate);
        await quote_model_1.QuoteItem.destroy({ where: { quoteId: quote.id } });
        await quote_model_1.QuoteItem.bulkCreate(data.items.map((item) => ({
            quoteId: quote.id,
            ...item,
            total: item.quantity * item.unitPrice,
        })));
        await quote.update({ ...data, totalHT, totalTVA, totalTTC });
    }
    else {
        await quote.update(data);
    }
    return quote;
}
