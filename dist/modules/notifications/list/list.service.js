"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotificationsService = listNotificationsService;
const notification_model_1 = require("../../../models/notification.model");
async function listNotificationsService(userId, query) {
    const { unread, type } = query;
    const where = { userId };
    if (unread === 'true')
        where.isRead = false;
    if (type)
        where.type = type;
    return notification_model_1.Notification.findAll({ where, order: [['createdAt', 'DESC']], limit: 100 });
}
