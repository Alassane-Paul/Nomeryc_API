"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFaqService = getFaqService;
const faq_model_1 = require("../../../models/faq.model");
async function getFaqService(id) {
    return faq_model_1.Faq.findByPk(id);
}
