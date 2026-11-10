"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const errorHandler_1 = require("../../../middlewares/errorHandler");
const response_1 = require("../../../utils/response");
const forgot_password_service_1 = require("./forgot-password.service");
exports.forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = forgot_password_service_1.forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    }
    await (0, forgot_password_service_1.forgotPasswordService)(parsed.data.email);
    return (0, response_1.sendResponse)(res, {
        responseCode: '00',
        responseMessage: 'Si un compte existe avec cet email, un lien de réinitialisation vient de lui être envoyé.',
        data: null,
    });
});
