"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAsRead = exports.markAllAsRead = exports.getUnreadCount = exports.getNotifications = void 0;
const notification_model_1 = require("../../models/notification.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
// GET /api/v1/notifications?unread=true&type=INVOICE
exports.getNotifications = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { unread, type } = req.query;
    const where = { userId: req.user?.id };
    if (unread === 'true')
        where.isRead = false;
    if (type)
        where.type = type;
    const notifications = await notification_model_1.Notification.findAll({ where, order: [['createdAt', 'DESC']], limit: 100 });
    return (0, response_1.sendResponse)(res, { data: notifications });
});
// GET /api/v1/notifications/unread-count
exports.getUnreadCount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const count = await notification_model_1.Notification.count({ where: { userId: req.user?.id, isRead: false } });
    return (0, response_1.sendResponse)(res, { data: { count } });
});
// PATCH /api/v1/notifications/read-all
exports.markAllAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await notification_model_1.Notification.update({ isRead: true }, { where: { userId: req.user?.id, isRead: false } });
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: null });
});
// PATCH /api/v1/notifications/:id/read
exports.markAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const notification = await notification_model_1.Notification.findOne({
        where: { id: String(req.params.id), userId: req.user?.id },
    });
    if (!notification)
        return (0, response_1.sendError)(res, '30', 'Notification non trouvée');
    await notification.update({ isRead: true });
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: notification });
});
// DELETE /api/v1/notifications/:id
exports.deleteNotification = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const deleted = await notification_model_1.Notification.destroy({
        where: { id: String(req.params.id), userId: req.user?.id },
    });
    if (!deleted)
        return (0, response_1.sendError)(res, '30', 'Notification non trouvée');
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
