"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaqService = deleteFaqService;
const faq_model_1 = require("../../../models/faq.model");
async function deleteFaqService(id) {
    const item = await faq_model_1.Faq.findByPk(id);
    if (!item)
        return false;
    await item.destroy();
    return true;
}
