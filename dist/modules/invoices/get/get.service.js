"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceService = getInvoiceService;
const invoice_model_1 = require("../../../models/invoice.model");
const user_model_1 = require("../../../models/user.model");
const project_model_1 = require("../../../models/project.model");
const quote_model_1 = require("../../../models/quote.model");
const user_enum_1 = require("../../../enums/user.enum");
async function getInvoiceService(id, userId, role) {
    const where = { id };
    if (role !== user_enum_1.UserRole.ADMIN)
        where.clientId = userId;
    return invoice_model_1.Invoice.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'company', 'phone'] },
            { model: project_model_1.Project, as: 'project' },
            { model: quote_model_1.Quote, as: 'quote' },
            { model: invoice_model_1.InvoiceItem, as: 'items' },
        ],
    });
}
