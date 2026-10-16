import { Router } from 'express';
import { createContactRequest, getContactRequests, updateContactStatus, deleteContactRequest, contactLimiter } from './contacts.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const contactsRouter = Router();

contactsRouter.post('/', contactLimiter, createContactRequest);
contactsRouter.get('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getContactRequests);
contactsRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updateContactStatus);
contactsRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deleteContactRequest);

export default contactsRouter;
