"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioItemService = getPortfolioItemService;
const portfolioItem_model_1 = require("../../../models/portfolioItem.model");
async function getPortfolioItemService(id) {
    return portfolioItem_model_1.PortfolioItem.findByPk(id);
}
