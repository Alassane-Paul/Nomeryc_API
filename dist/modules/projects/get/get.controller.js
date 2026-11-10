"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProject = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const get_service_1 = require("./get.service");
exports.getProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const project = await (0, get_service_1.getProject)(String(req.params.id), req.user?.id, req.user?.role);
    if (!project)
        return (0, response_1.sendError)(res, '32', 'Projet non trouvé');
    return (0, response_1.sendResponse)(res, { data: project });
});
