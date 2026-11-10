import { Document } from '../../../models/document.model';
import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

const includes = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName'] },
];

export async function getDocumentsService(
  user: { id?: string; role?: UserRole } | undefined,
  query: { category?: unknown; projectId?: unknown; clientId?: unknown },
) {
  const isAdmin = user?.role === UserRole.ADMIN;
  const where: any = {};
  if (query.category) where.category = query.category;
  if (query.projectId) where.projectId = query.projectId;
  where.clientId = isAdmin ? query.clientId || undefined : user?.id;
  if (where.clientId === undefined) delete where.clientId;

  return Document.findAll({ where, include: includes, order: [['createdAt', 'DESC']] });
}
