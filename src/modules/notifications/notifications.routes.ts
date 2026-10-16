import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from './notifications.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const notificationsRouter = Router();
notificationsRouter.use(authMiddleware);

notificationsRouter.get('/', getNotifications);
notificationsRouter.get('/unread-count', getUnreadCount);
notificationsRouter.patch('/read-all', markAllAsRead);
notificationsRouter.patch('/:id/read', markAsRead);
notificationsRouter.delete('/:id', deleteNotification);

export default notificationsRouter;
