"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUnreadNotificationsService = countUnreadNotificationsService;
const notification_model_1 = require("../../../models/notification.model");
async function countUnreadNotificationsService(userId) {
    return notification_model_1.Notification.count({ where: { userId, isRead: false } });
}
