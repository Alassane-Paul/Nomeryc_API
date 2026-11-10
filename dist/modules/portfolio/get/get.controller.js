"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioItem = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const get_service_1 = require("./get.service");
exports.getPortfolioItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await (0, get_service_1.getPortfolioItemService)(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Réalisation non trouvée');
    return (0, response_1.sendResponse)(res, { data: item });
});
