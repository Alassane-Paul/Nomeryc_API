"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotePdf = getQuotePdf;
const quote_model_1 = require("../../../models/quote.model");
const quote_model_2 = require("../../../models/quote.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
async function getQuotePdf(id, userId, role) {
    const where = { id };
    if (role !== user_enum_1.UserRole.ADMIN)
        where.clientId = userId;
    return quote_model_1.Quote.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
            { model: quote_model_2.QuoteItem, as: 'items' },
        ],
    });
}
