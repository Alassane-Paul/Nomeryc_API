"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoice = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const invoice = await (0, update_service_1.updateInvoiceService)(String(req.params.id), req.body);
    if (!invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: invoice });
});
