"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageService = deleteMessageService;
const message_model_1 = require("../../../models/message.model");
const socket_1 = require("../../../config/socket");
async function deleteMessageService(id, userId) {
    const message = await message_model_1.Message.findOne({ where: { id, senderId: userId } });
    if (!message)
        return false;
    const { id: messageId, recipientId } = message;
    await message.destroy();
    (0, socket_1.emitToAdmins)('message:deleted', { id: messageId });
    if (recipientId)
        (0, socket_1.emitToUser)(recipientId, 'message:deleted', { id: messageId });
    return true;
}
