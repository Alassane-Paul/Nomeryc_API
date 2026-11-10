"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPortfolioItemService = createPortfolioItemService;
const portfolioItem_model_1 = require("../../../models/portfolioItem.model");
async function createPortfolioItemService(body) {
    return portfolioItem_model_1.PortfolioItem.create(body);
}
