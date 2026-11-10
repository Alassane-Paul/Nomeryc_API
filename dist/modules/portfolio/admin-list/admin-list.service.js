"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllPortfolioService = listAllPortfolioService;
const portfolioItem_model_1 = require("../../../models/portfolioItem.model");
async function listAllPortfolioService() {
    return portfolioItem_model_1.PortfolioItem.findAll({ order: [['orderIndex', 'ASC']] });
}
