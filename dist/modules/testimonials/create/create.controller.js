"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestimonial = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const create_service_1 = require("./create.service");
exports.createTestimonial = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await (0, create_service_1.createTestimonial)(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: item });
});
