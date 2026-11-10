"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentsService = getDocumentsService;
const document_model_1 = require("../../../models/document.model");
const project_model_1 = require("../../../models/project.model");
const user_model_1 = require("../../../models/user.model");
const user_enum_1 = require("../../../enums/user.enum");
const includes = [
    { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
    { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName'] },
];
async function getDocumentsService(user, query) {
    const isAdmin = user?.role === user_enum_1.UserRole.ADMIN;
    const where = {};
    if (query.category)
        where.category = query.category;
    if (query.projectId)
        where.projectId = query.projectId;
    where.clientId = isAdmin ? query.clientId || undefined : user?.id;
    if (where.clientId === undefined)
        delete where.clientId;
    return document_model_1.Document.findAll({ where, include: includes, order: [['createdAt', 'DESC']] });
}
