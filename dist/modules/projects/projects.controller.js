"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const project_model_1 = require("../../models/project.model");
const user_model_1 = require("../../models/user.model");
const quote_model_1 = require("../../models/quote.model");
const invoice_model_1 = require("../../models/invoice.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const user_enum_1 = require("../../enums/user.enum");
const projet_enum_1 = require("../../enums/projet.enum");
const service_enum_1 = require("../../enums/service.enum");
const zod_1 = require("zod");
const projectSchema = zod_1.z.object({
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
// GET /api/v1/projects
exports.getProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const where = isAdmin ? {} : { clientId: req.user?.id };
    const projects = await project_model_1.Project.findAll({
        where,
        include: [{ model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] }],
        order: [['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: projects });
});
// GET /api/v1/projects/:id
exports.getProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const project = await project_model_1.Project.findOne({
        where,
        include: [
            { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] },
            { model: quote_model_1.Quote, as: 'quotes' },
            { model: invoice_model_1.Invoice, as: 'invoices' },
        ],
    });
    if (!project)
        return (0, response_1.sendError)(res, '32', 'Projet non trouvé');
    return (0, response_1.sendResponse)(res, { data: project });
});
// POST /api/v1/projects
exports.createProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const clientId = isAdmin ? (parsed.data.clientId || req.user?.id) : req.user?.id;
    const { clientId: _ignored, status, ...rest } = parsed.data;
    const project = await project_model_1.Project.create({
        ...rest,
        clientId,
        ...(status ? { status } : {}),
    });
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: project });
});
// PATCH /api/v1/projects/:id
exports.updateProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const id = String(req.params.id);
    const where = { id };
    if (!isAdmin)
        where.clientId = req.user?.id;
    const project = await project_model_1.Project.findOne({ where });
    if (!project)
        return (0, response_1.sendError)(res, '32', 'Projet non trouvé');
    await project.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: project });
});
// DELETE /api/v1/projects/:id (Admin only)
exports.deleteProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const project = await project_model_1.Project.findByPk(String(req.params.id));
    if (!project)
        return (0, response_1.sendError)(res, '32', 'Projet non trouvé');
    await project.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
