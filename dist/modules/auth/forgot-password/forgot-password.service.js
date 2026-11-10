"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = void 0;
exports.forgotPasswordService = forgotPasswordService;
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const user_model_1 = require("../../../models/user.model");
const mail_service_1 = require("../../../services/mail.service");
const env_1 = require("../../../config/env");
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
});
async function forgotPasswordService(email) {
    try {
        const user = await user_model_1.User.findOne({ where: { email } });
        if (user) {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            const tokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
            await user.update({
                resetPasswordToken: tokenHash,
                resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
            });
            const resetUrl = `${env_1.env.FRONTEND_URL}/reset-password?token=${token}`;
            const mail = mail_service_1.mailTemplates.passwordReset(user.firstName, resetUrl);
            await (0, mail_service_1.sendMail)({ to: user.email, ...mail });
        }
        return { success: true };
    }
    catch (error) {
        console.error('Erreur forgotPassword:', error);
        return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la demande de réinitialisation' };
    }
}
