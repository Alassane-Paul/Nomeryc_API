"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPortfolioItems = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const admin_list_service_1 = require("./admin-list.service");
exports.getAllPortfolioItems = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    return (0, response_1.sendResponse)(res, { data: await (0, admin_list_service_1.listAllPortfolioService)() });
});
