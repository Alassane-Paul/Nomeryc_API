"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMessagesService = listMessagesService;
const sequelize_1 = require("sequelize");
const message_model_1 = require("../../../models/message.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
const senderInclude = { model: user_model_1.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: user_model_1.User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
async function listMessagesService(userId, role, query) {
    const isAdmin = role === user_enum_1.UserRole.ADMIN;
    const { projectId, clientId } = query;
    let where;
    if (projectId)
        where = { projectId };
    else if (isAdmin) {
        if (!clientId)
            return { error: 'clientId requis pour un admin (ou utilisez /messages/conversations)' };
        where = { [sequelize_1.Op.or]: [{ senderId: clientId }, { recipientId: clientId }] };
    }
    else {
        where = { [sequelize_1.Op.or]: [{ senderId: userId }, { recipientId: userId }] };
    }
    const messages = await message_model_1.Message.findAll({ where, include: [senderInclude, recipientInclude], order: [['createdAt', 'ASC']] });
    return { messages };
}
