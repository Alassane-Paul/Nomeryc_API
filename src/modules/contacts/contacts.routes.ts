import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createContactRequest } from './create/create.controller';
import { getContactRequests } from './list/list.controller';
import { updateContactStatus } from './update/update.controller';
import { deleteContactRequest } from './delete/delete.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const contactsRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { responseCode: '98', responseMessage: 'Trop de messages envoyés, réessayez dans 1 heure.' },
});

contactsRouter.post('/', contactLimiter, createContactRequest);
contactsRouter.get('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getContactRequests);
contactsRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updateContactStatus);
contactsRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deleteContactRequest);

export default contactsRouter;
