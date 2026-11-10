"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFaqsService = getAllFaqsService;
const faq_model_1 = require("../../../models/faq.model");
async function getAllFaqsService() {
    return faq_model_1.Faq.findAll({ order: [['orderIndex', 'ASC']] });
}
