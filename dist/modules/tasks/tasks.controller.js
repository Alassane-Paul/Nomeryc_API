"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const zod_1 = require("zod");
const task_model_1 = require("../../models/task.model");
const project_model_1 = require("../../models/project.model");
const user_model_1 = require("../../models/user.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const task_enum_1 = require("../../enums/task.enum");
const notification_service_1 = require("../../services/notification.service");
const includes = [
    { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
    { model: user_model_1.User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
];
const taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Titre requis'),
    description: zod_1.z.string().optional(),
    projectId: zod_1.z.string().uuid().optional().nullable(),
    assigneeId: zod_1.z.string().uuid().optional().nullable(),
    status: zod_1.z.nativeEnum(task_enum_1.TaskStatus).optional(),
    priority: zod_1.z.nativeEnum(task_enum_1.TaskPriority).optional(),
    dueDate: zod_1.z.coerce.date().optional().nullable(),
    position: zod_1.z.number().int().optional(),
});
// GET /api/v1/tasks?status=&projectId=&assigneeId=
exports.getTasks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status, projectId, assigneeId } = req.query;
    const where = {};
    if (status)
        where.status = status;
    if (projectId)
        where.projectId = projectId;
    if (assigneeId)
        where.assigneeId = assigneeId;
    const tasks = await task_model_1.Task.findAll({
        where,
        include: includes,
        order: [['position', 'ASC'], ['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: tasks });
});
// POST /api/v1/tasks
exports.createTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const task = await task_model_1.Task.create(parsed.data);
    // L'assigné est prévenu (s'il n'est pas l'auteur de la tâche).
    if (task.assigneeId && task.assigneeId !== req.user?.id) {
        await (0, notification_service_1.notify)({
            userId: task.assigneeId,
            title: 'Nouvelle tâche assignée',
            message: task.title,
            type: 'PROJECT',
            link: '/admin/taches',
        });
    }
    const full = await task_model_1.Task.findByPk(task.id, { include: includes });
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: full });
});
// PATCH /api/v1/tasks/:id
exports.updateTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_model_1.Task.findByPk(String(req.params.id));
    if (!task)
        return (0, response_1.sendError)(res, '30', 'Tâche non trouvée');
    const parsed = taskSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const payload = { ...parsed.data };
    // completedAt suit automatiquement le passage en "done".
    if (payload.status === task_enum_1.TaskStatus.DONE && task.status !== task_enum_1.TaskStatus.DONE) {
        payload.completedAt = new Date();
    }
    else if (payload.status && payload.status !== task_enum_1.TaskStatus.DONE) {
        payload.completedAt = null;
    }
    await task.update(payload);
    const full = await task_model_1.Task.findByPk(task.id, { include: includes });
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: full });
});
// DELETE /api/v1/tasks/:id
exports.deleteTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_model_1.Task.findByPk(String(req.params.id));
    if (!task)
        return (0, response_1.sendError)(res, '30', 'Tâche non trouvée');
    await task.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
