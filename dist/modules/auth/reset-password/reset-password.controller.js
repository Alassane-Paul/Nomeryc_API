"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const reset_password_service_1 = require("./reset-password.service");
exports.resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = reset_password_service_1.resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    }
    const result = await (0, reset_password_service_1.resetPasswordService)(parsed.data.token, parsed.data.password);
    if (!result.success) {
        return (0, response_1.sendError)(res, result.errorCode || '99', result.errorMessage);
    }
    return (0, response_1.sendResponse)(res, {
        responseCode: '00',
        responseMessage: 'Mot de passe réinitialisé avec succès.',
        data: null,
    });
});
