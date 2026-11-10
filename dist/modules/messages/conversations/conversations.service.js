"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConversationsService = listConversationsService;
const message_model_1 = require("../../../models/message.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
const senderInclude = { model: user_model_1.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: user_model_1.User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
async function listConversationsService() {
    const messages = await message_model_1.Message.findAll({ include: [senderInclude, recipientInclude], order: [['createdAt', 'DESC']] });
    const conversations = new Map();
    for (const msg of messages) {
        const client = msg.sender?.role === user_enum_1.UserRole.CLIENT ? msg.sender : msg.recipient?.role === user_enum_1.UserRole.CLIENT ? msg.recipient : null;
        if (!client)
            continue;
        if (!conversations.has(client.id))
            conversations.set(client.id, { client, lastMessage: msg, unreadCount: 0 });
        if (msg.senderId === client.id && !msg.isRead)
            conversations.get(client.id).unreadCount += 1;
    }
    return Array.from(conversations.values());
}
