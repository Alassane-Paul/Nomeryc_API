"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamMember = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const get_service_1 = require("./get.service");
exports.getTeamMember = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const member = await (0, get_service_1.getTeamMember)(String(req.params.id));
    if (!member)
        return (0, response_1.sendError)(res, '30', 'Membre introuvable');
    return (0, response_1.sendResponse)(res, { data: member });
});
