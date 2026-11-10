"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFedapayPayment = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const fedapay_service_1 = require("./fedapay.service");
exports.initFedapayPayment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, fedapay_service_1.initFedapayPaymentService)(String(req.params.id), req.user?.id, req.user?.role, req.body);
    if (result === 'unconfigured')
        return (0, response_1.sendError)(res, '99', 'Le paiement Mobile Money n\'est pas encore configuré.');
    if (result === 'not-found')
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    if (result === 'paid')
        return (0, response_1.sendError)(res, '12', 'Cette facture est déjà payée');
    if (result === 'client-not-found')
        return (0, response_1.sendError)(res, '30', 'Client introuvable');
    if (result === 'transaction-error')
        return (0, response_1.sendError)(res, '99', 'Impossible de créer la transaction Mobile Money pour le moment.');
    return (0, response_1.sendResponse)(res, { data: { url: result.url } });
});
