"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getFaq = exports.getAllFaqs = exports.getFaqs = void 0;
const faq_model_1 = require("../../models/faq.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.getFaqs = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await faq_model_1.Faq.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getAllFaqs = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await faq_model_1.Faq.findAll({ order: [['orderIndex', 'ASC']] });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getFaq = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await faq_model_1.Faq.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Question introuvable');
    return (0, response_1.sendResponse)(res, { data: item });
});
exports.createFaq = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await faq_model_1.Faq.create(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: item });
});
exports.updateFaq = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await faq_model_1.Faq.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Question introuvable');
    await item.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: item });
});
exports.deleteFaq = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await faq_model_1.Faq.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Question introuvable');
    await item.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
