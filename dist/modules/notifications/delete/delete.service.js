"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotificationService = deleteNotificationService;
const notification_model_1 = require("../../../models/notification.model");
async function deleteNotificationService(id, userId) {
    return notification_model_1.Notification.destroy({ where: { id, userId } });
}
