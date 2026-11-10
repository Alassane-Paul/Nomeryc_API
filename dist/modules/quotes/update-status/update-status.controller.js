"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuoteStatus = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_status_service_1 = require("./update-status.service");
exports.updateQuoteStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, update_status_service_1.updateQuoteStatus)(String(req.params.id), req.user?.id, req.user?.role, req.body.status);
    if ('error' in result && result.error === 'not-found')
        return (0, response_1.sendError)(res, '30', 'Devis non trouvé');
    if ('error' in result && result.error === 'invalid-status')
        return (0, response_1.sendError)(res, '10', 'Statut invalide');
    if ('error' in result)
        return (0, response_1.sendError)(res, '23', 'Action non autorisée');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: result.quote });
});
