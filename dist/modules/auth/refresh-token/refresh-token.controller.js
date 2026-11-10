"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const refresh_token_service_1 = require("./refresh-token.service");
exports.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const token = req.body.refreshToken || req.headers['x-refresh-token'];
    if (!token) {
        return (0, response_1.sendError)(res, '20', 'Token de rafraîchissement requis');
    }
    const result = await (0, refresh_token_service_1.refreshTokenService)(String(token));
    if (!result.success) {
        return (0, response_1.sendError)(res, result.errorCode || '22', result.errorMessage);
    }
    return (0, response_1.sendResponse)(res, {
        data: {
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken,
        },
    });
});
