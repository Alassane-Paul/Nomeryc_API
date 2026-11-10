"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageService = sendMessageService;
const message_model_1 = require("../../../models/message.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
const socket_1 = require("../../../config/socket");
const notification_service_1 = require("../../../services/notification.service");
const senderInclude = { model: user_model_1.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: user_model_1.User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
async function sendMessageService(user, body) {
    const isAdmin = user.role === user_enum_1.UserRole.ADMIN;
    const { projectId, content, attachments } = body;
    let recipientId = body.recipientId || null;
    if (!content || content.trim().length === 0)
        return { error: 'Le message ne peut pas être vide' };
    if (isAdmin) {
        if (!recipientId)
            return { error: 'recipientId requis : un admin doit préciser le client destinataire' };
        const client = await user_model_1.User.findByPk(recipientId);
        if (!client || client.role !== user_enum_1.UserRole.CLIENT)
            return { error: 'Destinataire invalide' };
    }
    else
        recipientId = null;
    const message = await message_model_1.Message.create({
        senderId: user.id, projectId, recipientId: recipientId ?? undefined,
        content: content.trim(), attachments, isRead: false,
    });
    const fullMessage = await message_model_1.Message.findByPk(message.id, { include: [senderInclude, recipientInclude] });
    if (isAdmin) {
        (0, socket_1.emitToUser)(recipientId, 'message:new', fullMessage);
        (0, socket_1.emitToAdmins)('message:new', fullMessage);
        (0, notification_service_1.notify)({ userId: recipientId, title: 'Nouveau message', message: content.trim().slice(0, 100), type: 'MESSAGE', link: '/client/messages' });
    }
    else {
        (0, socket_1.emitToAdmins)('message:new', fullMessage);
        const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id'] });
        (0, notification_service_1.notifyMany)(admins.map((a) => a.id), {
            title: 'Nouveau message client', message: content.trim().slice(0, 100), type: 'MESSAGE', link: '/admin/messages',
        });
    }
    return { message: fullMessage };
}
