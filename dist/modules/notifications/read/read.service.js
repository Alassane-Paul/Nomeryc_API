"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationReadService = markNotificationReadService;
const notification_model_1 = require("../../../models/notification.model");
async function markNotificationReadService(id, userId) {
    const notification = await notification_model_1.Notification.findOne({ where: { id, userId } });
    if (!notification)
        return null;
    await notification.update({ isRead: true });
    return notification;
}
