"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFaqService = createFaqService;
const faq_model_1 = require("../../../models/faq.model");
async function createFaqService(data) {
    return faq_model_1.Faq.create(data);
}
