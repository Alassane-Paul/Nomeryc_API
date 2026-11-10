"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = notify;
exports.notifyMany = notifyMany;
const notification_model_1 = require("../models/notification.model");
const socket_1 = require("../config/socket");
/**
 * Crée une notification en base ET la pousse en temps réel au destinataire.
 * Ne throw jamais : une notification ratée ne doit pas faire échouer l'action métier.
 */
async function notify(input) {
    try {
        const notification = await notification_model_1.Notification.create({
            userId: input.userId,
            title: input.title,
            message: input.message,
            type: input.type || 'SYSTEM',
            link: input.link,
            isRead: false,
        });
        (0, socket_1.emitToUser)(input.userId, 'notification:new', notification);
        return notification;
    }
    catch (error) {
        console.error('❌ Échec création notification :', error?.message);
        return null;
    }
}
/** Notifie plusieurs utilisateurs en parallèle. */
async function notifyMany(userIds, input) {
    await Promise.all(userIds.map((userId) => notify({ ...input, userId })));
}
