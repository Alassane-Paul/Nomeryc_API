"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuotes = listQuotes;
const quote_model_1 = require("../../../models/quote.model");
const quote_model_2 = require("../../../models/quote.model");
const user_model_1 = require("../../../models/user.model");
const project_model_1 = require("../../../models/project.model");
const user_enum_1 = require("../../../enums/user.enum");
async function listQuotes(userId, role) {
    const where = role === user_enum_1.UserRole.ADMIN ? {} : { clientId: userId };
    return quote_model_1.Quote.findAll({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
            { model: quote_model_2.QuoteItem, as: 'items' },
        ],
        order: [['createdAt', 'DESC']],
    });
}
