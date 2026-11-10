import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

export async function listProjects(userId: string | undefined, role: UserRole | undefined) {
  const where = role === UserRole.ADMIN ? {} : { clientId: userId };
  return Project.findAll({
    where,
    include: [{ model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] }],
    order: [['createdAt', 'DESC']],
  });
}
