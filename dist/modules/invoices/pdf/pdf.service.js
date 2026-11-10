"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoicePdfService = getInvoicePdfService;
const invoice_model_1 = require("../../../models/invoice.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
async function getInvoicePdfService(id, userId, role) {
    const where = { id };
    if (role !== user_enum_1.UserRole.ADMIN)
        where.clientId = userId;
    return invoice_model_1.Invoice.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
            { model: invoice_model_1.InvoiceItem, as: 'items' },
        ],
    });
}
