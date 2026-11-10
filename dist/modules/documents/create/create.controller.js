"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const create_service_1 = require("./create.service");
exports.createDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, create_service_1.createDocumentService)(req.body, req.user?.id);
    if ('error' in result && result.error === 'invalid') {
        return (0, response_1.sendError)(res, '10', 'Données invalides', result.details);
    }
    if ('error' in result && result.error === 'client-not-found')
        return (0, response_1.sendError)(res, '31', 'Client non trouvé');
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: result.document });
});
