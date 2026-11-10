import { Router } from 'express';
import { getUsers } from './list/list.controller';
import { getUser } from './get/get.controller';
import { updateUser } from './update/update.controller';
import { changePassword } from './change-password/change-password.controller';
import { deleteUser } from './delete/delete.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const usersRouter = Router();
usersRouter.use(authMiddleware);

usersRouter.get('/', authorizationMiddleware([UserRole.ADMIN]), getUsers);
usersRouter.get('/:id', getUser);
usersRouter.patch('/:id', updateUser);
usersRouter.patch('/:id/password', changePassword);
usersRouter.delete('/:id', authorizationMiddleware([UserRole.ADMIN]), deleteUser);

export default usersRouter;
