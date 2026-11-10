"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const unsubscribe_service_1 = require("./unsubscribe.service");
exports.unsubscribe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, unsubscribe_service_1.unsubscribeService)(req.body, req.query);
    if (result === 'missing-token')
        return (0, response_1.sendError)(res, '11', 'Token requis');
    if (result === 'not-found')
        return (0, response_1.sendError)(res, '30', 'Abonnement introuvable');
    return (0, response_1.sendResponse)(res, { responseCode: '00', responseMessage: 'Désabonnement effectué.', data: null });
});
