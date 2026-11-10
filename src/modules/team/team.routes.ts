import { Router } from 'express';
import {
  getTeamMembers,
} from './list/list.controller';
import { getTeamMember } from './get/get.controller';
import { getAllTeamMembers } from './list-all/list-all.controller';
import { createTeamMember } from './create/create.controller';
import { updateTeamMember } from './update/update.controller';
import { deleteTeamMember } from './delete/delete.controller';
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
