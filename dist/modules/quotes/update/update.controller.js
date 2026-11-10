"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuote = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateQuote = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const quote = await (0, update_service_1.updateQuote)(String(req.params.id), req.body);
    if (!quote)
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: quote });
});
