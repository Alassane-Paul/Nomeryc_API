import { Task } from '../../../models/task.model';
import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';

const includes = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
];

export async function listTasks(query: { status?: any; projectId?: any; assigneeId?: any }) {
  const where: any = {};
  if (query.status) where.status = query.status;
  if (query.projectId) where.projectId = query.projectId;
  if (query.assigneeId) where.assigneeId = query.assigneeId;
  return Task.findAll({
    where,
    include: includes,
    order: [['position', 'ASC'], ['createdAt', 'DESC']],
  });
}
