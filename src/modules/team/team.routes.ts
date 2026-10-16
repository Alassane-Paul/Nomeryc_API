import { Router } from 'express';
import {
  getTeamMembers,
  getTeamMember,
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from './team.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const teamRouter = Router();

teamRouter.get('/', getTeamMembers);
teamRouter.get('/admin/all', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getAllTeamMembers);
teamRouter.get('/:id', getTeamMember);
teamRouter.post('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), createTeamMember);
teamRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updateTeamMember);
teamRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deleteTeamMember);

export default teamRouter;
