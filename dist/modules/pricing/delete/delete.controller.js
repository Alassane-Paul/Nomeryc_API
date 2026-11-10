"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePricingPlan = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const delete_service_1 = require("./delete.service");
exports.deletePricingPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const deleted = await (0, delete_service_1.deletePricingPlan)(String(req.params.id));
    if (!deleted)
        return (0, response_1.sendError)(res, '30', 'Offre introuvable');
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
