"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, update_service_1.updateUser)(String(req.params.id), req.user?.id, req.user?.role, req.body);
    if ('error' in result && result.error === 'forbidden')
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    if ('error' in result)
        return (0, response_1.sendError)(res, '31', 'Utilisateur non trouvé');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: result.updated });
});
