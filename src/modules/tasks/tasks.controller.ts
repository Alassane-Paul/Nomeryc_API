import { Response } from 'express';
import { z } from 'zod';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { TaskStatus, TaskPriority } from '../../enums/task.enum';
import { notify } from '../../services/notification.service';

const includes = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
];

const taskSchema = z.object({
  title: z.string().min(2, 'Titre requis'),
  description: z.string().optional(),
  projectId: z.string().uuid().optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  position: z.number().int().optional(),
});

// GET /api/v1/tasks?status=&projectId=&assigneeId=
export const getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status, projectId, assigneeId } = req.query;
  const where: any = {};
  if (status) where.status = status;
  if (projectId) where.projectId = projectId;
  if (assigneeId) where.assigneeId = assigneeId;

  const tasks = await Task.findAll({
    where,
    include: includes,
    order: [['position', 'ASC'], ['createdAt', 'DESC']],
  });

  return sendResponse(res, { data: tasks });
});

// POST /api/v1/tasks
export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  const task = await Task.create(parsed.data as any);

  // L'assigné est prévenu (s'il n'est pas l'auteur de la tâche).
  if (task.assigneeId && task.assigneeId !== req.user?.id) {
    await notify({
      userId: task.assigneeId,
      title: 'Nouvelle tâche assignée',
      message: task.title,
      type: 'PROJECT',
      link: '/admin/taches',
    });
  }

  const full = await Task.findByPk(task.id, { include: includes });
  return sendResponse(res, { responseCode: '01', data: full });
});

// PATCH /api/v1/tasks/:id
export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const task = await Task.findByPk(String(req.params.id));
  if (!task) return sendError(res, '30', 'Tâche non trouvée');

  const parsed = taskSchema.partial().safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  const payload: any = { ...parsed.data };
  // completedAt suit automatiquement le passage en "done".
  if (payload.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
    payload.completedAt = new Date();
  } else if (payload.status && payload.status !== TaskStatus.DONE) {
    payload.completedAt = null;
  }

  await task.update(payload);
  const full = await Task.findByPk(task.id, { include: includes });
  return sendResponse(res, { responseCode: '02', data: full });
});

// DELETE /api/v1/tasks/:id
export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const task = await Task.findByPk(String(req.params.id));
  if (!task) return sendError(res, '30', 'Tâche non trouvée');
  await task.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
