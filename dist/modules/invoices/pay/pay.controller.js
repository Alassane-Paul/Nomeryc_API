"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsPaid = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const pay_service_1 = require("./pay.service");
exports.markAsPaid = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, pay_service_1.markInvoicePaidService)(String(req.params.id), req.user?.id, req.user?.role, req.body);
    if (!result.invoice)
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    return (0, response_1.sendResponse)(res, {
        responseCode: '02', responseMessage: 'Facture marquée comme payée', data: result.invoice,
    });
});
