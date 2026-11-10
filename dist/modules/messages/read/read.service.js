"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessageReadService = markMessageReadService;
const message_model_1 = require("../../../models/message.model");
const user_enum_1 = require("../../../enums/user.enum");
const socket_1 = require("../../../config/socket");
async function markMessageReadService(id, user) {
    const message = await message_model_1.Message.findByPk(id);
    if (!message)
        return 'missing';
    const isAdmin = user.role === user_enum_1.UserRole.ADMIN;
    const authorized = isAdmin ? message.senderId !== user.id : message.recipientId === user.id;
    if (!authorized)
        return 'forbidden';
    await message.update({ isRead: true });
    (0, socket_1.emitToUser)(message.senderId, 'message:read', { ids: [message.id] });
    return message;
}
