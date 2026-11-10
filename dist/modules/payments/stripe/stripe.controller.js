"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStripePayment = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const stripe_service_1 = require("./stripe.service");
exports.initStripePayment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, stripe_service_1.initStripePaymentService)(String(req.params.id), req.user?.id, req.user?.role);
    if (result === 'unconfigured')
        return (0, response_1.sendError)(res, '99', 'Le paiement par carte n\'est pas encore configuré.');
    if (result === 'not-found')
        return (0, response_1.sendError)(res, '30', 'Facture non trouvée');
    if (result === 'paid')
        return (0, response_1.sendError)(res, '12', 'Cette facture est déjà payée');
    if (result === 'client-not-found')
        return (0, response_1.sendError)(res, '30', 'Client introuvable');
    return (0, response_1.sendResponse)(res, { data: { url: result.url } });
});
