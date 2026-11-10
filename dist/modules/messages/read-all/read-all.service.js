"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllMessagesReadService = markAllMessagesReadService;
const message_model_1 = require("../../../models/message.model");
const user_enum_1 = require("../../../enums/user.enum");
const socket_1 = require("../../../config/socket");
async function markAllMessagesReadService(user, body, query) {
    if (user.role === user_enum_1.UserRole.ADMIN) {
        const clientId = (body.clientId || query.clientId);
        if (!clientId)
            return false;
        await message_model_1.Message.update({ isRead: true }, { where: { senderId: clientId, isRead: false } });
        (0, socket_1.emitToUser)(clientId, 'message:read', { all: true });
    }
    else {
        await message_model_1.Message.update({ isRead: true }, { where: { recipientId: user.id, isRead: false } });
        (0, socket_1.emitToAdmins)('message:read', { all: true, clientId: user.id });
    }
    return true;
}
