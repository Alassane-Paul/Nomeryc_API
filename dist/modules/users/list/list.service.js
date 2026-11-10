"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
const user_model_1 = require("../../../models/user.model");
async function listUsers() {
    return user_model_1.User.findAll({
        attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
        order: [['createdAt', 'DESC']],
    });
}
