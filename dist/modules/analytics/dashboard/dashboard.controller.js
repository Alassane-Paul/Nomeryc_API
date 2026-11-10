"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalytics = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const dashboard_service_1 = require("./dashboard.service");
exports.getDashboardAnalytics = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const data = await (0, dashboard_service_1.getDashboardAnalyticsService)();
    return (0, response_1.sendResponse)(res, { data });
});
