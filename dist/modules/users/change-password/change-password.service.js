"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = changePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../../../models/user.model");
async function changePassword(id, requesterId, currentPassword, newPassword) {
    if (id !== requesterId)
        return { error: 'forbidden' };
    if (!currentPassword || !newPassword)
        return { error: 'missing-password' };
    const user = await user_model_1.User.findByPk(id);
    if (!user || !user.password)
        return { error: 'not-found' };
    const isValid = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isValid)
        return { error: 'invalid-password' };
    const hashed = await bcryptjs_1.default.hash(newPassword, 12);
    await user.update({ password: hashed });
    return { success: true };
}
