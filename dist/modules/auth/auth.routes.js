"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_controller_1 = require("./login/login.controller");
const register_controller_1 = require("./register/register.controller");
const profile_controller_1 = require("./profile/profile.controller");
const refresh_token_controller_1 = require("./refresh-token/refresh-token.controller");
const logout_controller_1 = require("./logout/logout.controller");
const forgot_password_controller_1 = require("./forgot-password/forgot-password.controller");
const reset_password_controller_1 = require("./reset-password/reset-password.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRouter = (0, express_1.Router)();
// Rate limiting strict pour l'authentification
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { responseCode: '98', responseMessage: 'Trop de tentatives, réessayez dans 15 minutes.' },
});
authRouter.post('/login', authLimiter, login_controller_1.login);
authRouter.post('/register', register_controller_1.register);
authRouter.post('/refresh', refresh_token_controller_1.refreshToken);
authRouter.post('/forgot-password', authLimiter, forgot_password_controller_1.forgotPassword);
authRouter.post('/reset-password', authLimiter, reset_password_controller_1.resetPassword);
authRouter.get('/me', auth_middleware_1.authMiddleware, profile_controller_1.getMe);
authRouter.post('/logout', auth_middleware_1.authMiddleware, logout_controller_1.logout);
exports.default = authRouter;
