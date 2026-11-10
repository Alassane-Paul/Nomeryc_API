"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamMember = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const create_service_1 = require("./create.service");
exports.createTeamMember = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const member = await (0, create_service_1.createTeamMember)(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: member });
});
