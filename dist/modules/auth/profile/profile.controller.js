"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const profile_service_1 = require("./profile.service");
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.id) {
        return (0, response_1.sendError)(res, '20', 'Authentification requise');
    }
    const result = await (0, profile_service_1.getCurrentUserService)(req.user.id);
    if (!result.success) {
        return (0, response_1.sendError)(res, result.errorCode || '99', result.errorMessage);
    }
    return (0, response_1.sendResponse)(res, { data: result.user });
});
