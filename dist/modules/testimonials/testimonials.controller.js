"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonial = exports.getAllTestimonials = exports.getTestimonials = void 0;
const testimonial_model_1 = require("../../models/testimonial.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.getTestimonials = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await testimonial_model_1.Testimonial.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getAllTestimonials = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await testimonial_model_1.Testimonial.findAll({ order: [['orderIndex', 'ASC']] });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getTestimonial = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await testimonial_model_1.Testimonial.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Témoignage introuvable');
    return (0, response_1.sendResponse)(res, { data: item });
});
exports.createTestimonial = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await testimonial_model_1.Testimonial.create(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: item });
});
exports.updateTestimonial = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await testimonial_model_1.Testimonial.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Témoignage introuvable');
    await item.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: item });
});
exports.deleteTestimonial = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await testimonial_model_1.Testimonial.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Témoignage introuvable');
    await item.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
