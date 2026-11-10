"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsReadService = markAllNotificationsReadService;
const notification_model_1 = require("../../../models/notification.model");
async function markAllNotificationsReadService(userId) {
    return notification_model_1.Notification.update({ isRead: true }, { where: { userId, isRead: false } });
}
