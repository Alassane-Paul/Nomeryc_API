"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const login_service_1 = require("./login.service");
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = login_service_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    }
    const result = await (0, login_service_1.loginService)(parsed.data);
    if (!result.success) {
        return (0, response_1.sendError)(res, result.errorCode || '99', result.errorMessage);
    }
    return (0, response_1.sendResponse)(res, {
        responseCode: '00',
        data: {
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken,
        },
    });
});
