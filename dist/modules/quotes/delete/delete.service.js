"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuote = deleteQuote;
const quote_model_1 = require("../../../models/quote.model");
async function deleteQuote(id) {
    const quote = await quote_model_1.Quote.findByPk(id);
    if (!quote)
        return false;
    await quote.destroy();
    return true;
}
