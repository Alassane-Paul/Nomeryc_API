"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const register_service_1 = require("./register.service");
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = register_service_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    }
    const result = await (0, register_service_1.registerService)(parsed.data);
    if (!result.success) {
        return (0, response_1.sendError)(res, result.errorCode || '99', result.errorMessage);
    }
    return (0, response_1.sendResponse)(res, {
        responseCode: '01',
        data: {
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken,
        },
    });
});
