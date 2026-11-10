import { Router } from 'express';
import { getMessages } from './list/list.controller';
import { getConversations } from './conversations/conversations.controller';
import { sendMessage } from './send/send.controller';
import { markMessageAsRead } from './read/read.controller';
import { markAllAsRead } from './read-all/read-all.controller';
import { deleteMessage } from './delete/delete.controller';
import { getUnreadMessageCount } from './unread-count/unread-count.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const messagesRouter = Router();
messagesRouter.use(authMiddleware);

messagesRouter.get('/', getMessages);
messagesRouter.get('/unread-count', getUnreadMessageCount);
messagesRouter.get('/conversations', authorizationMiddleware([UserRole.ADMIN]), getConversations);
messagesRouter.post('/', sendMessage);
messagesRouter.patch('/read-all', markAllAsRead);
messagesRouter.patch('/:id/read', markMessageAsRead);
messagesRouter.delete('/:id', deleteMessage);

export default messagesRouter;
