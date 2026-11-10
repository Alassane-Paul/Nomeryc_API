import { Router } from 'express';
import { getNotifications } from './list/list.controller';
import { getUnreadCount } from './unread-count/unread-count.controller';
import { markAsRead } from './read/read.controller';
import { markAllAsRead } from './read-all/read-all.controller';
import { deleteNotification } from './delete/delete.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const notificationsRouter = Router();
notificationsRouter.use(authMiddleware);

notificationsRouter.get('/', getNotifications);
notificationsRouter.get('/unread-count', getUnreadCount);
notificationsRouter.patch('/read-all', markAllAsRead);
notificationsRouter.patch('/:id/read', markAsRead);
notificationsRouter.delete('/:id', deleteNotification);

export default notificationsRouter;
