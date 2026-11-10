"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const get_service_1 = require("./get.service");
exports.getUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, get_service_1.getUser)(String(req.params.id), req.user?.id, req.user?.role);
    if ('error' in result && result.error === 'forbidden')
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    if ('error' in result)
        return (0, response_1.sendError)(res, '31', 'Utilisateur non trouvé');
    return (0, response_1.sendResponse)(res, { data: result.user });
});
