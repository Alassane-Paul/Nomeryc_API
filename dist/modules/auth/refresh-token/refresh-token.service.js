"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenService = refreshTokenService;
const user_model_1 = require("../../../models/user.model");
const jwt_utils_1 = require("../../../utils/jwt.utils");
async function refreshTokenService(refreshToken) {
    try {
        const decoded = (0, jwt_utils_1.verifyToken)(refreshToken);
        if (!decoded || decoded.type !== 'refresh_token') {
            return { success: false, errorCode: '22', errorMessage: 'Token de rafraîchissement invalide ou expiré' };
        }
        const user = await user_model_1.User.findByPk(decoded.userId, {
            attributes: { exclude: ['password', 'resetPasswordToken'] },
        });
        if (!user) {
            return { success: false, errorCode: '31', errorMessage: 'Utilisateur non trouvé' };
        }
        const accessToken = (0, jwt_utils_1.generateAccessToken)(user.id, user.email, user.role);
        const newRefreshToken = (0, jwt_utils_1.generateRefreshToken)(user.id);
        return {
            success: true,
            user: user.toJSON(),
            token: accessToken,
            refreshToken: newRefreshToken,
        };
    }
    catch (error) {
        console.error('Erreur refreshToken:', error);
        return { success: false, errorCode: '99', errorMessage: 'Erreur lors du rafraîchissement du token' };
    }
}
