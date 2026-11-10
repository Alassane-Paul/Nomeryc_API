"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoice = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const get_service_1 = require("./get.service");
exports.getInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const invoice = await (0, get_service_1.getInvoiceService)(String(req.params.id), req.user?.id, req.user?.role);
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    return (0, response_1.sendResponse)(res, { data: invoice });
});
