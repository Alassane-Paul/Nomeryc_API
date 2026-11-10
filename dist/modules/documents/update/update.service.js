"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocumentService = updateDocumentService;
const zod_1 = require("zod");
const document_model_1 = require("../../../models/document.model");
const project_model_1 = require("../../../models/project.model");
const user_model_1 = require("../../../models/user.model");
const document_enum_1 = require("../../../enums/document.enum");
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
async function updateDocumentService(id, body) {
    const document = await document_model_1.Document.findByPk(id);
    if (!document)
        return { error: 'not-found' };
    const parsed = documentSchema.partial().safeParse(body);
    if (!parsed.success)
        return { error: 'invalid', details: parsed.error.flatten() };
    await document.update(parsed.data);
    const full = await document_model_1.Document.findByPk(document.id, { include: includes });
    return { document: full };
}
