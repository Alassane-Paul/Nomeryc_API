"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessageAsRead = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const read_service_1 = require("./read.service");
exports.markMessageAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, read_service_1.markMessageReadService)(String(req.params.id), req.user);
    if (result === 'missing')
        return (0, response_1.sendError)(res, '30', 'Message non trouvé');
    if (result === 'forbidden')
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: result });
});
