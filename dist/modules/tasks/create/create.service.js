"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSchema = void 0;
exports.createTask = createTask;
const zod_1 = require("zod");
const task_model_1 = require("../../../models/task.model");
const project_model_1 = require("../../../models/project.model");
const user_model_1 = require("../../../models/user.model");
const task_enum_1 = require("../../../enums/task.enum");
const notification_service_1 = require("../../../services/notification.service");
const includes = [
    { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
    { model: user_model_1.User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
];
exports.taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Titre requis'),
    description: zod_1.z.string().optional(),
    projectId: zod_1.z.string().uuid().optional().nullable(),
    assigneeId: zod_1.z.string().uuid().optional().nullable(),
    status: zod_1.z.nativeEnum(task_enum_1.TaskStatus).optional(),
    priority: zod_1.z.nativeEnum(task_enum_1.TaskPriority).optional(),
    dueDate: zod_1.z.coerce.date().optional().nullable(),
    position: zod_1.z.number().int().optional(),
});
async function createTask(data, authorId) {
    const task = await task_model_1.Task.create(data);
    if (task.assigneeId && task.assigneeId !== authorId) {
        await (0, notification_service_1.notify)({
            userId: task.assigneeId,
            title: 'Nouvelle tâche assignée',
            message: task.title,
            type: 'PROJECT',
            link: '/admin/taches',
        });
    }
    return task_model_1.Task.findByPk(task.id, { include: includes });
}
