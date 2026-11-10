"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = updateUser;
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
async function updateUser(id, requesterId, role, data) {
    const isAdmin = role === user_enum_1.UserRole.ADMIN;
    if (!isAdmin && id !== requesterId)
        return { error: 'forbidden' };
    const user = await user_model_1.User.findByPk(id);
    if (!user)
        return { error: 'not-found' };
    const payload = { ...data };
    if (!isAdmin) {
        delete payload.role;
        delete payload.status;
    }
    await user.update(payload);
    const updated = await user_model_1.User.findByPk(id, {
        attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
    });
    return { updated };
}
