"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = deleteUser;
const user_model_1 = require("../../../models/user.model");
async function deleteUser(id) {
    const user = await user_model_1.User.findByPk(id);
    if (!user)
        return false;
    await user.destroy();
    return true;
}
