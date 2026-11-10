"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePricingPlan = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updatePricingPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await (0, update_service_1.updatePricingPlan)(String(req.params.id), req.body);
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Offre introuvable');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: item });
});
