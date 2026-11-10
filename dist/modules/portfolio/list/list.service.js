"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPortfolioService = listPortfolioService;
const portfolioItem_model_1 = require("../../../models/portfolioItem.model");
async function listPortfolioService(query) {
    const { category, featured } = query;
    const where = { isPublic: true };
    if (category)
        where.category = category;
    if (featured === 'true')
        where.featured = true;
    return portfolioItem_model_1.PortfolioItem.findAll({ where, order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']] });
}
