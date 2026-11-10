"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicStats = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const public_stats_service_1 = require("./public-stats.service");
exports.getPublicStats = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const data = await (0, public_stats_service_1.getPublicStatsService)();
    return (0, response_1.sendResponse)(res, { data });
});
