import { z } from 'zod';
import { Task } from '../../../models/task.model';
import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { TaskStatus, TaskPriority } from '../../../enums/task.enum';

const includes = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
];

export const taskUpdateSchema = z.object({
  title: z.string().min(2, 'Titre requis'),
  description: z.string().optional(),
  projectId: z.string().uuid().optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  position: z.number().int().optional(),
}).partial();

export async function updateTask(id: string, data: z.infer<typeof taskUpdateSchema>) {
  const task = await Task.findByPk(id);
  if (!task) return null;
  const payload: any = { ...data };
  if (payload.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
    payload.completedAt = new Date();
  } else if (payload.status && payload.status !== TaskStatus.DONE) {
    payload.completedAt = null;
  }
  await task.update(payload);
  return Task.findByPk(task.id, { include: includes });
}
