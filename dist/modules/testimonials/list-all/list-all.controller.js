"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTestimonials = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const list_all_service_1 = require("./list-all.service");
exports.getAllTestimonials = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const items = await (0, list_all_service_1.listAllTestimonials)();
    return (0, response_1.sendResponse)(res, { data: items });
});
