"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const create_service_1 = require("./create.service");
exports.createProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = create_service_1.projectSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const project = await (0, create_service_1.createProject)(parsed.data, req.user?.id, req.user?.role);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: project });
});
