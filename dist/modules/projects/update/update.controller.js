"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const project = await (0, update_service_1.updateProject)(String(req.params.id), req.body, req.user?.id, req.user?.role);
    if (!project)
        return (0, response_1.sendError)(res, '32', 'Projet non trouvé');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: project });
});
