import { Project } from '../../../models/project.model';
import { UserRole } from '../../../enums/user.enum';

export async function updateProject(id: string, data: any, userId: string | undefined, role: UserRole | undefined) {
  const where: any = { id };
  if (role !== UserRole.ADMIN) where.clientId = userId;
  const project = await Project.findOne({ where });
  if (!project) return null;
  await project.update(data);
  return project;
}
