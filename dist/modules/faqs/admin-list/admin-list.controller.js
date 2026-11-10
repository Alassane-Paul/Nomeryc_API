"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFaqs = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const admin_list_service_1 = require("./admin-list.service");
exports.getAllFaqs = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const data = await (0, admin_list_service_1.getAllFaqsService)();
    return (0, response_1.sendResponse)(res, { data });
});
