"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = updateProject;
const project_model_1 = require("../../../models/project.model");
const user_enum_1 = require("../../../enums/user.enum");
async function updateProject(id, data, userId, role) {
    const where = { id };
    if (role !== user_enum_1.UserRole.ADMIN)
        where.clientId = userId;
    const project = await project_model_1.Project.findOne({ where });
    if (!project)
        return null;
    await project.update(data);
    return project;
}
