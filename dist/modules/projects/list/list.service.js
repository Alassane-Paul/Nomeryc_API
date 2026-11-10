"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = listProjects;
const project_model_1 = require("../../../models/project.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
async function listProjects(userId, role) {
    const where = role === user_enum_1.UserRole.ADMIN ? {} : { clientId: userId };
    return project_model_1.Project.findAll({
        where,
        include: [{ model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] }],
        order: [['createdAt', 'DESC']],
    });
}
