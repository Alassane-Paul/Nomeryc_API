import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from './tasks.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const tasksRouter = Router();
// Les tâches sont un outil interne : réservées aux admins.
tasksRouter.use(authMiddleware, authorizationMiddleware([UserRole.ADMIN]));

tasksRouter.get('/', getTasks);
tasksRouter.post('/', createTask);
tasksRouter.patch('/:id', updateTask);
tasksRouter.delete('/:id', deleteTask);

export default tasksRouter;
