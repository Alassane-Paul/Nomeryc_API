"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.markAllAsRead = exports.markMessageAsRead = exports.sendMessage = exports.getConversations = exports.getMessages = void 0;
const sequelize_1 = require("sequelize");
const message_model_1 = require("../../models/message.model");
const user_model_1 = require("../../models/user.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_enum_1 = require("../../enums/user.enum");
const socket_1 = require("../../config/socket");
const notification_service_1 = require("../../services/notification.service");
const senderInclude = { model: user_model_1.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: user_model_1.User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
// GET /api/v1/messages?projectId=...   ou   ?clientId=... (admin uniquement)
exports.getMessages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const { projectId, clientId } = req.query;
    let where;
    if (projectId) {
        where = { projectId };
    }
    else if (isAdmin) {
        if (!clientId) {
            return (0, response_1.sendError)(res, '11', 'clientId requis pour un admin (ou utilisez /messages/conversations)');
        }
        // Fil de discussion avec ce client : ses messages sortants (recipientId null)
        // + les réponses qui lui sont adressées.
        where = { [sequelize_1.Op.or]: [{ senderId: clientId }, { recipientId: clientId }] };
    }
    else {
        // Le client voit tout ce qu'il a envoyé + tout ce qui lui a été adressé.
        where = { [sequelize_1.Op.or]: [{ senderId: req.user?.id }, { recipientId: req.user?.id }] };
    }
    const messages = await message_model_1.Message.findAll({
        where,
        include: [senderInclude, recipientInclude],
        order: [['createdAt', 'ASC']],
    });
    return (0, response_1.sendResponse)(res, { data: messages });
});
// GET /api/v1/messages/conversations (admin uniquement)
// Liste des clients ayant échangé, avec dernier message + nb de non-lus.
exports.getConversations = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const messages = await message_model_1.Message.findAll({
        include: [senderInclude, recipientInclude],
        order: [['createdAt', 'DESC']],
    });
    const conversations = new Map();
    for (const msg of messages) {
        const client = msg.sender?.role === user_enum_1.UserRole.CLIENT ? msg.sender : msg.recipient?.role === user_enum_1.UserRole.CLIENT ? msg.recipient : null;
        if (!client)
            continue; // message sans lien avec un client (ne devrait pas arriver)
        if (!conversations.has(client.id)) {
            conversations.set(client.id, { client, lastMessage: msg, unreadCount: 0 });
        }
        // Non-lu = message envoyé PAR le client et pas encore lu par l'équipe.
        if (msg.senderId === client.id && !msg.isRead) {
            conversations.get(client.id).unreadCount += 1;
        }
    }
    return (0, response_1.sendResponse)(res, { data: Array.from(conversations.values()) });
});
// POST /api/v1/messages
exports.sendMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const { projectId, content, attachments } = req.body;
    let recipientId = req.body.recipientId || null;
    if (!content || content.trim().length === 0) {
        return (0, response_1.sendError)(res, '11', 'Le message ne peut pas être vide');
    }
    if (isAdmin) {
        if (!recipientId) {
            return (0, response_1.sendError)(res, '11', 'recipientId requis : un admin doit préciser le client destinataire');
        }
        const client = await user_model_1.User.findByPk(recipientId);
        if (!client || client.role !== user_enum_1.UserRole.CLIENT) {
            return (0, response_1.sendError)(res, '11', 'Destinataire invalide');
        }
    }
    else {
        // Un client s'adresse toujours au support ; on ignore tout recipientId fourni.
        recipientId = null;
    }
    const message = await message_model_1.Message.create({
        senderId: req.user.id,
        projectId,
        recipientId: recipientId ?? undefined,
        content: content.trim(),
        attachments,
        isRead: false,
    });
    const fullMessage = await message_model_1.Message.findByPk(message.id, {
        include: [senderInclude, recipientInclude],
    });
    // ===== TEMPS RÉEL + NOTIFICATIONS PERSISTANTES =====
    if (isAdmin) {
        // Réponse de l'équipe → le client concerné.
        (0, socket_1.emitToUser)(recipientId, 'message:new', fullMessage);
        (0, socket_1.emitToAdmins)('message:new', fullMessage);
        (0, notification_service_1.notify)({
            userId: recipientId,
            title: 'Nouveau message',
            message: content.trim().slice(0, 100),
            type: 'MESSAGE',
            link: '/client/messages',
        });
    }
    else {
        // Message client → tous les admins connectés.
        (0, socket_1.emitToAdmins)('message:new', fullMessage);
        const admins = await user_model_1.User.findAll({ where: { role: user_enum_1.UserRole.ADMIN }, attributes: ['id'] });
        (0, notification_service_1.notifyMany)(admins.map((a) => a.id), {
            title: 'Nouveau message client',
            message: content.trim().slice(0, 100),
            type: 'MESSAGE',
            link: '/admin/messages',
        });
    }
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: fullMessage });
});
// PATCH /api/v1/messages/:id/read
exports.markMessageAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const message = await message_model_1.Message.findByPk(String(req.params.id));
    if (!message)
        return (0, response_1.sendError)(res, '30', 'Message non trouvé');
    // Un admin peut marquer comme lu tout message qui ne vient pas de lui-même
    // (i.e. un message client). Un client ne peut marquer comme lu que ce qui lui est adressé.
    const authorized = isAdmin ? message.senderId !== req.user?.id : message.recipientId === req.user?.id;
    if (!authorized)
        return (0, response_1.sendError)(res, '23', 'Accès refusé');
    await message.update({ isRead: true });
    // Accusé de lecture temps réel vers l'expéditeur.
    (0, socket_1.emitToUser)(message.senderId, 'message:read', { ids: [message.id] });
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: message });
});
// PATCH /api/v1/messages/read-all
// Client : marque tout ce qui lui a été adressé comme lu.
// Admin : body/query { clientId } — marque tous les messages de ce client comme lus.
exports.markAllAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    if (isAdmin) {
        const clientId = (req.body.clientId || req.query.clientId);
        if (!clientId)
            return (0, response_1.sendError)(res, '11', 'clientId requis');
        await message_model_1.Message.update({ isRead: true }, { where: { senderId: clientId, isRead: false } });
        (0, socket_1.emitToUser)(clientId, 'message:read', { all: true });
    }
    else {
        await message_model_1.Message.update({ isRead: true }, { where: { recipientId: req.user?.id, isRead: false } });
        (0, socket_1.emitToAdmins)('message:read', { all: true, clientId: req.user?.id });
    }
    return (0, response_1.sendResponse)(res, { responseMessage: 'Tous les messages marqués comme lus', data: null });
});
// DELETE /api/v1/messages/:id
exports.deleteMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const message = await message_model_1.Message.findOne({
        where: { id: req.params.id, senderId: req.user?.id },
    });
    if (!message)
        return (0, response_1.sendError)(res, '30', 'Message non trouvé');
    const { id, recipientId } = message;
    await message.destroy();
    (0, socket_1.emitToAdmins)('message:deleted', { id });
    if (recipientId)
        (0, socket_1.emitToUser)(recipientId, 'message:deleted', { id });
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
