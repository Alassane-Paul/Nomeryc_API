"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactRequestsService = getContactRequestsService;
const contactRequest_model_1 = require("../../../models/contactRequest.model");
async function getContactRequestsService(status) {
    const where = {};
    if (status)
        where.status = status;
    return contactRequest_model_1.ContactRequest.findAll({ where, order: [['createdAt', 'DESC']] });
}
