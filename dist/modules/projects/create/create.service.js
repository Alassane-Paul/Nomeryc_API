"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = void 0;
exports.createProject = createProject;
const zod_1 = require("zod");
const project_model_1 = require("../../../models/project.model");
const user_enum_1 = require("../../../enums/user.enum");
const projet_enum_1 = require("../../../enums/projet.enum");
const service_enum_1 = require("../../../enums/service.enum");
exports.projectSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    service: zod_1.z.nativeEnum(service_enum_1.ServiceType),
    status: zod_1.z.nativeEnum(projet_enum_1.ProjectStatus).optional(),
    budget: zod_1.z.number().positive().optional(),
    startDate: zod_1.z.string().optional(),
    deadline: zod_1.z.string().optional(),
    deliverables: zod_1.z.array(zod_1.z.any()).optional(),
    assignedTeam: zod_1.z.array(zod_1.z.any()).optional(),
});
async function createProject(data, userId, role) {
    const clientId = role === user_enum_1.UserRole.ADMIN ? (data.clientId || userId) : userId;
    const { clientId: _ignored, status, ...rest } = data;
    return project_model_1.Project.create({
        ...rest,
        clientId,
        ...(status ? { status } : {}),
    });
}
