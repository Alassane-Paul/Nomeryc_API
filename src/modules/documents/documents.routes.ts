import { Router } from 'express';
import { getDocuments } from './list/list.controller';
import { createDocument } from './create/create.controller';
import { updateDocument } from './update/update.controller';
import { deleteDocument } from './delete/delete.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const documentsRouter = Router();
documentsRouter.use(authMiddleware);

documentsRouter.get('/', getDocuments);
documentsRouter.post('/', authorizationMiddleware([UserRole.ADMIN]), createDocument);
documentsRouter.patch('/:id', authorizationMiddleware([UserRole.ADMIN]), updateDocument);
documentsRouter.delete('/:id', authorizationMiddleware([UserRole.ADMIN]), deleteDocument);

export default documentsRouter;
