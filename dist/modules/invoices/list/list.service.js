"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInvoicesService = listInvoicesService;
const invoice_model_1 = require("../../../models/invoice.model");
const user_model_1 = require("../../../models/user.model");
const project_model_1 = require("../../../models/project.model");
const user_enum_1 = require("../../../enums/user.enum");
async function listInvoicesService(userId, role) {
    const where = role === user_enum_1.UserRole.ADMIN ? {} : { clientId: userId };
    return invoice_model_1.Invoice.findAll({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
        ],
        order: [['createdAt', 'DESC']],
    });
}
