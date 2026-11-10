"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
exports.loginService = loginService;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const user_model_1 = require("../../../models/user.model");
const jwt_utils_1 = require("../../../utils/jwt.utils");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
    password: zod_1.z.string().min(1, 'Mot de passe requis'),
});
async function loginService(data) {
    try {
        const user = await user_model_1.User.findOne({ where: { email: data.email } });
        if (!user) {
            return { success: false, errorCode: '21', errorMessage: 'Email ou mot de passe incorrect' };
        }
        if (user.status === 'inactive' || user.status === 'suspended') {
            return { success: false, errorCode: '50', errorMessage: 'Ce compte est désactivé. Contactez le support.' };
        }
        if (!user.password) {
            return { success: false, errorCode: '21', errorMessage: 'Email ou mot de passe incorrect' };
        }
        const passwordMatch = await bcryptjs_1.default.compare(data.password, user.password);
        if (!passwordMatch) {
            return { success: false, errorCode: '21', errorMessage: 'Email ou mot de passe incorrect' };
        }
        const accessToken = (0, jwt_utils_1.generateAccessToken)(user.id, user.email, user.role);
        const refreshToken = (0, jwt_utils_1.generateRefreshToken)(user.id);
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                company: user.company,
                status: user.status,
            },
            token: accessToken,
            refreshToken,
        };
    }
    catch (error) {
        console.error('Erreur login:', error);
        return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la connexion' };
    }
}
