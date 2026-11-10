"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserService = getCurrentUserService;
const user_model_1 = require("../../../models/user.model");
async function getCurrentUserService(userId) {
    try {
        const user = await user_model_1.User.findByPk(userId, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
        });
        if (!user) {
            return { success: false, errorCode: '31', errorMessage: 'Utilisateur non trouvé' };
        }
        return { success: true, user: user.toJSON() };
    }
    catch (error) {
        console.error('Erreur getCurrentUser:', error);
        return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la récupération du profil' };
    }
}
