"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFaqService = updateFaqService;
const faq_model_1 = require("../../../models/faq.model");
async function updateFaqService(id, data) {
    const item = await faq_model_1.Faq.findByPk(id);
    if (!item)
        return null;
    await item.update(data);
    return item;
}
