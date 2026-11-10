import { z } from 'zod';
import { Task } from '../../../models/task.model';
import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { TaskStatus, TaskPriority } from '../../../enums/task.enum';
import { notify } from '../../../services/notification.service';

const includes = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
];

export const taskSchema = z.object({
  title: z.string().min(2, 'Titre requis'),
  description: z.string().optional(),
  projectId: z.string().uuid().optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  position: z.number().int().optional(),
});

export type TaskData = z.infer<typeof taskSchema>;

export async function createTask(data: TaskData, authorId: string | undefined) {
  const task = await Task.create(data as any);
  if (task.assigneeId && task.assigneeId !== authorId) {
    await notify({
      userId: task.assigneeId,
      title: 'Nouvelle tâche assignée',
      message: task.title,
      type: 'PROJECT',
      link: '/admin/taches',
    });
  }
  return Task.findByPk(task.id, { include: includes });
}
