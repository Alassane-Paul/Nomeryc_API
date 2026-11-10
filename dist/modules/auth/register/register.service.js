"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
exports.registerService = registerService;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
const jwt_utils_1 = require("../../../utils/jwt.utils");
const mail_service_1 = require("../../../services/mail.service");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
    password: zod_1.z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    firstName: zod_1.z.string().min(2, 'Le prénom est requis'),
    lastName: zod_1.z.string().min(2, 'Le nom est requis'),
    phone: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    role: zod_1.z.nativeEnum(user_enum_1.UserRole).optional().default(user_enum_1.UserRole.CLIENT),
});
async function registerService(data) {
    try {
        const existingUser = await user_model_1.User.findOne({ where: { email: data.email } });
        if (existingUser) {
            return { success: false, errorCode: '41', errorMessage: 'Cet email est déjà utilisé' };
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const user = await user_model_1.User.create({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            company: data.company,
            role: data.role || user_enum_1.UserRole.CLIENT,
        });
        const accessToken = (0, jwt_utils_1.generateAccessToken)(user.id, user.email, user.role);
        const refreshToken = (0, jwt_utils_1.generateRefreshToken)(user.id);
        const welcome = mail_service_1.mailTemplates.welcome(user.firstName);
        (0, mail_service_1.sendMail)({ to: user.email, ...welcome });
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                company: user.company,
                status: user.status,
            },
            token: accessToken,
            refreshToken,
        };
    }
    catch (error) {
        console.error('Erreur register:', error);
        return { success: false, errorCode: '99', errorMessage: 'Erreur lors de l\'inscription' };
    }
}
