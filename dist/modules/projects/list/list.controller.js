"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const list_service_1 = require("./list.service");
exports.getProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const projects = await (0, list_service_1.listProjects)(req.user?.id, req.user?.role);
    return (0, response_1.sendResponse)(res, { data: projects });
});
