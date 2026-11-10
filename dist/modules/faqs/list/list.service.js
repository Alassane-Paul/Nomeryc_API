"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFaqsService = getFaqsService;
const faq_model_1 = require("../../../models/faq.model");
async function getFaqsService() {
    return faq_model_1.Faq.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
}
