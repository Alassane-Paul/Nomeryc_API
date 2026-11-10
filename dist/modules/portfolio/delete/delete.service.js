"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolioItemService = deletePortfolioItemService;
const portfolioItem_model_1 = require("../../../models/portfolioItem.model");
async function deletePortfolioItemService(id) {
    const item = await portfolioItem_model_1.PortfolioItem.findByPk(id);
    if (!item)
        return false;
    await item.destroy();
    return true;
}
