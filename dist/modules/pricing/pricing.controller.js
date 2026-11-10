"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePricingPlan = exports.updatePricingPlan = exports.createPricingPlan = exports.getPricingPlan = exports.getAllPricingPlans = exports.getPricingPlans = void 0;
const pricingPlan_model_1 = require("../../models/pricingPlan.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.getPricingPlans = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await pricingPlan_model_1.PricingPlan.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getAllPricingPlans = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await pricingPlan_model_1.PricingPlan.findAll({ order: [['orderIndex', 'ASC']] });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getPricingPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await pricingPlan_model_1.PricingPlan.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Offre introuvable');
    return (0, response_1.sendResponse)(res, { data: item });
});
exports.createPricingPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await pricingPlan_model_1.PricingPlan.create(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: item });
});
exports.updatePricingPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await pricingPlan_model_1.PricingPlan.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Offre introuvable');
    await item.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: item });
});
exports.deletePricingPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await pricingPlan_model_1.PricingPlan.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Offre introuvable');
    await item.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
