"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestimonial = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const get_service_1 = require("./get.service");
exports.getTestimonial = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const item = await (0, get_service_1.getTestimonial)(String(req.params.id));
    if (!item)
        return (0, response_1.sendError)(res, '30', 'Témoignage introuvable');
    return (0, response_1.sendResponse)(res, { data: item });
});
