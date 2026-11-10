"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePortfolioItemService = updatePortfolioItemService;
const portfolioItem_model_1 = require("../../../models/portfolioItem.model");
async function updatePortfolioItemService(id, body) {
    const item = await portfolioItem_model_1.PortfolioItem.findByPk(id);
    if (!item)
        return null;
    await item.update(body);
    return item;
}
