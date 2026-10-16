import { Router } from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from './projects.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const projectsRouter = Router();

projectsRouter.use(authMiddleware);

projectsRouter.get('/', getProjects);
projectsRouter.get('/:id', getProject);
projectsRouter.post('/', createProject);
projectsRouter.patch('/:id', updateProject);
projectsRouter.delete('/:id', authorizationMiddleware([UserRole.ADMIN]), deleteProject);

export default projectsRouter;
