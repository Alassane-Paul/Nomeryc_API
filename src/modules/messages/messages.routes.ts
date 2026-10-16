import { Router } from 'express';
import {
  getMessages,
  getConversations,
  sendMessage,
  markMessageAsRead,
  markAllAsRead,
  deleteMessage,
} from './messages.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const messagesRouter = Router();
messagesRouter.use(authMiddleware);

messagesRouter.get('/', getMessages);
messagesRouter.get('/conversations', authorizationMiddleware([UserRole.ADMIN]), getConversations);
messagesRouter.post('/', sendMessage);
messagesRouter.patch('/read-all', markAllAsRead);
messagesRouter.patch('/:id/read', markMessageAsRead);
messagesRouter.delete('/:id', deleteMessage);

export default messagesRouter;
