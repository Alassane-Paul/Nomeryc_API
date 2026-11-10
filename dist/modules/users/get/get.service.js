"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
async function getUser(id, requesterId, role) {
    if (role !== user_enum_1.UserRole.ADMIN && id !== requesterId) {
        return { error: 'forbidden' };
    }
    const user = await user_model_1.User.findByPk(id, {
        attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
    });
    if (!user)
        return { error: 'not-found' };
    return { user };
}
