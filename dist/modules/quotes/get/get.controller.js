"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuote = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const get_service_1 = require("./get.service");
exports.getQuote = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const quote = await (0, get_service_1.getQuote)(String(req.params.id), req.user?.id, req.user?.role);
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    return (0, response_1.sendResponse)(res, { data: quote });
});
