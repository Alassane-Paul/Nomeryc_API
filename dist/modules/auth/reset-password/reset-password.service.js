"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = void 0;
exports.resetPasswordService = resetPasswordService;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const user_model_1 = require("../../../models/user.model");
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token requis'),
    password: zod_1.z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});
async function resetPasswordService(token, newPassword) {
    try {
        const tokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await user_model_1.User.findOne({
            where: {
                resetPasswordToken: tokenHash,
                resetPasswordExpires: { [sequelize_1.Op.gte]: new Date() },
            },
        });
        if (!user) {
            return { success: false, errorCode: '22', errorMessage: 'Lien invalide ou expiré' };
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });
        return { success: true };
    }
    catch (error) {
        console.error('Erreur resetPassword:', error);
        return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la réinitialisation' };
    }
}
