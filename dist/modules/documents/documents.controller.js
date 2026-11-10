"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocuments = void 0;
const zod_1 = require("zod");
const document_model_1 = require("../../models/document.model");
const project_model_1 = require("../../models/project.model");
const user_model_1 = require("../../models/user.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const document_enum_1 = require("../../enums/document.enum");
const user_enum_1 = require("../../enums/user.enum");
const notification_service_1 = require("../../services/notification.service");
const includes = [
    { model: project_model_1.Project, as: 'project', attributes: ['id', 'title'] },
    { model: user_model_1.User, as: 'client', attributes: ['id', 'firstName', 'lastName'] },
];
const documentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nom requis'),
    url: zod_1.z.string().url('URL invalide'),
    mimeType: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    category: zod_1.z.nativeEnum(document_enum_1.DocumentCategory).optional(),
    clientId: zod_1.z.string().uuid('clientId invalide'),
    projectId: zod_1.z.string().uuid().optional().nullable(),
});
// GET /api/v1/documents?category=&projectId=&clientId=
exports.getDocuments = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user?.role === user_enum_1.UserRole.ADMIN;
    const { category, projectId, clientId } = req.query;
    const where = {};
    if (category)
        where.category = category;
    if (projectId)
        where.projectId = projectId;
    // Un client ne voit QUE ses propres documents, quoi qu'il demande.
    where.clientId = isAdmin ? (clientId || undefined) : req.user?.id;
    if (where.clientId === undefined)
        delete where.clientId;
    const documents = await document_model_1.Document.findAll({ where, include: includes, order: [['createdAt', 'DESC']] });
    return (0, response_1.sendResponse)(res, { data: documents });
});
// POST /api/v1/documents (admin) — le fichier est d'abord envoyé via /uploads
exports.createDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = documentSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const client = await user_model_1.User.findByPk(parsed.data.clientId);
    if (!client)
        return (0, response_1.sendError)(res, '31', 'Client non trouvé');
    const document = await document_model_1.Document.create({ ...parsed.data, uploadedById: req.user?.id });
    await (0, notification_service_1.notify)({
        userId: document.clientId,
        title: 'Nouveau document disponible',
        message: document.name,
        type: 'PROJECT',
        link: '/client/documents',
    });
    const full = await document_model_1.Document.findByPk(document.id, { include: includes });
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: full });
});
// PATCH /api/v1/documents/:id (admin)
exports.updateDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const document = await document_model_1.Document.findByPk(String(req.params.id));
    if (!document)
        return (0, response_1.sendError)(res, '30', 'Document non trouvé');
    const parsed = documentSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    await document.update(parsed.data);
    const full = await document_model_1.Document.findByPk(document.id, { include: includes });
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: full });
});
// DELETE /api/v1/documents/:id (admin)
exports.deleteDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const document = await document_model_1.Document.findByPk(String(req.params.id));
    if (!document)
        return (0, response_1.sendError)(res, '30', 'Document non trouvé');
    await document.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
