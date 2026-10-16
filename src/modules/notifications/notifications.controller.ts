import { Response } from 'express';
import { Notification } from '../../models/notification.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';

// GET /api/v1/notifications?unread=true&type=INVOICE
export const getNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { unread, type } = req.query;
  const where: any = { userId: req.user?.id };
  if (unread === 'true') where.isRead = false;
  if (type) where.type = type;

  const notifications = await Notification.findAll({ where, order: [['createdAt', 'DESC']], limit: 100 });
  return sendResponse(res, { data: notifications });
});

// GET /api/v1/notifications/unread-count
export const getUnreadCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const count = await Notification.count({ where: { userId: req.user?.id, isRead: false } });
  return sendResponse(res, { data: { count } });
});

// PATCH /api/v1/notifications/read-all
export const markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await Notification.update({ isRead: true }, { where: { userId: req.user?.id, isRead: false } });
  return sendResponse(res, { responseCode: '02', data: null });
});

// PATCH /api/v1/notifications/:id/read
export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const notification = await Notification.findOne({
    where: { id: String(req.params.id), userId: req.user?.id },
  });
  if (!notification) return sendError(res, '30', 'Notification non trouvée');

  await notification.update({ isRead: true });
  return sendResponse(res, { responseCode: '02', data: notification });
});

// DELETE /api/v1/notifications/:id
export const deleteNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await Notification.destroy({
    where: { id: String(req.params.id), userId: req.user?.id },
  });
  if (!deleted) return sendError(res, '30', 'Notification non trouvée');
  return sendResponse(res, { responseCode: '03', data: null });
});
