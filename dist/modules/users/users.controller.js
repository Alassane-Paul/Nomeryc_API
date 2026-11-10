"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changePassword = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../../models/user.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_enum_1 = require("../../enums/user.enum");
exports.getUsers = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const users = await user_model_1.User.findAll({
        attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
        order: [['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: users });
});
exports.getUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    if (!isAdmin && id !== req.user?.id) {
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    }
    const user = await user_model_1.User.findByPk(id, {
        attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
    });
    if (!user)
        return (0, response_1.sendError)(res, '31', 'Utilisateur non trouvé');
    return (0, response_1.sendResponse)(res, { data: user });
});
exports.updateUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    if (!isAdmin && id !== req.user?.id) {
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    }
    const user = await user_model_1.User.findByPk(id);
    if (!user)
        return (0, response_1.sendError)(res, '31', 'Utilisateur non trouvé');
    if (!isAdmin) {
        delete req.body.role;
        delete req.body.status;
    }
    await user.update(req.body);
    const updated = await user_model_1.User.findByPk(id, {
        attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
    });
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: updated });
});
exports.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = String(req.params.id);
    if (id !== req.user?.id) {
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return (0, response_1.sendError)(res, '11', 'Mot de passe actuel et nouveau requis');
    }
    const user = await user_model_1.User.findByPk(id);
    if (!user || !user.password)
        return (0, response_1.sendError)(res, '31', 'Utilisateur non trouvé');
    const isValid = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isValid)
        return (0, response_1.sendError)(res, '21', 'Mot de passe actuel incorrect');
    const hashed = await bcryptjs_1.default.hash(newPassword, 12);
    await user.update({ password: hashed });
    return (0, response_1.sendResponse)(res, { responseMessage: 'Mot de passe modifié avec succès', data: null });
});
exports.deleteUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await user_model_1.User.findByPk(String(req.params.id));
    if (!user)
        return (0, response_1.sendError)(res, '31', 'Utilisateur non trouvé');
    await user.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
