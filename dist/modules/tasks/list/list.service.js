"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTasks = listTasks;
const task_model_1 = require("../../../models/task.model");
const project_model_1 = require("../../../models/project.model");
const user_model_1 = require("../../../models/user.model");
const includes = [
    { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
    { model: user_model_1.User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
];
async function listTasks(query) {
    const where = {};
    if (query.status)
        where.status = query.status;
    if (query.projectId)
        where.projectId = query.projectId;
    if (query.assigneeId)
        where.assigneeId = query.assigneeId;
    return task_model_1.Task.findAll({
        where,
        include: includes,
        order: [['position', 'ASC'], ['createdAt', 'DESC']],
    });
}
