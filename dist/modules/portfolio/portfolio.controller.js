"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolioItem = exports.updatePortfolioItem = exports.createPortfolioItem = exports.getPortfolioItem = exports.getAllPortfolioItems = exports.getPortfolioItems = void 0;
const portfolioItem_model_1 = require("../../models/portfolioItem.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.getPortfolioItems = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { category, featured } = req.query;
    const where = { isPublic: true };
    if (category)
        where.category = category;
    if (featured === 'true')
        where.featured = true;
    const items = await portfolioItem_model_1.PortfolioItem.findAll({
        where,
        order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getAllPortfolioItems = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await portfolioItem_model_1.PortfolioItem.findAll({ order: [['orderIndex', 'ASC']] });
    return (0, response_1.sendResponse)(res, { data: items });
});
exports.getPortfolioItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await portfolioItem_model_1.PortfolioItem.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Réalisation non trouvée');
    return (0, response_1.sendResponse)(res, { data: item });
});
exports.createPortfolioItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await portfolioItem_model_1.PortfolioItem.create(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: item });
});
exports.updatePortfolioItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await portfolioItem_model_1.PortfolioItem.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Réalisation non trouvée');
    await item.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: item });
});
exports.deletePortfolioItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await portfolioItem_model_1.PortfolioItem.findByPk(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Réalisation non trouvée');
    await item.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
