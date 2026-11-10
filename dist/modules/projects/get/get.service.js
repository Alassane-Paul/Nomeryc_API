"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProject = getProject;
const project_model_1 = require("../../../models/project.model");
const user_model_1 = require("../../../models/user.model");
const quote_model_1 = require("../../../models/quote.model");
const invoice_model_1 = require("../../../models/invoice.model");
const user_enum_1 = require("../../../enums/user.enum");
async function getProject(id, userId, role) {
    const where = { id };
    if (role !== user_enum_1.UserRole.ADMIN)
        where.clientId = userId;
    return project_model_1.Project.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] },
            { model: quote_model_1.Quote, as: 'quotes' },
            { model: invoice_model_1.Invoice, as: 'invoices' },
        ],
    });
}
