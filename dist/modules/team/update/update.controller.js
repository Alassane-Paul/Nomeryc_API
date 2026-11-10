"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamMember = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const update_service_1 = require("./update.service");
exports.updateTeamMember = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const member = await (0, update_service_1.updateTeamMember)(String(req.params.id), req.body);
    if (!member)
        return (0, response_1.sendError)(res, '30', 'Membre introuvable');
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: member });
});
