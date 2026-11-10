"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocument = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, update_service_1.updateDocumentService)(String(req.params.id), req.body);
    if ('error' in result && result.error === 'not-found')
        return (0, response_1.sendError)(res, '30', 'Document non trouvé');
    if ('error' in result && result.error === 'invalid') {
        return (0, response_1.sendError)(res, '10', 'Données invalides', result.details);
    }
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: result.document });
});
