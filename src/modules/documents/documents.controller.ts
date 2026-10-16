import { Response } from 'express';
import { z } from 'zod';
import { Document } from '../../models/document.model';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { DocumentCategory } from '../../enums/document.enum';
import { UserRole } from '../../enums/user.enum';
import { notify } from '../../services/notification.service';

const includes = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName'] },
];

const documentSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  url: z.string().url('URL invalide'),
  mimeType: z.string().optional(),
  size: z.string().optional(),
  category: z.nativeEnum(DocumentCategory).optional(),
  clientId: z.string().uuid('clientId invalide'),
  projectId: z.string().uuid().optional().nullable(),
});

// GET /api/v1/documents?category=&projectId=&clientId=
export const getDocuments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const { category, projectId, clientId } = req.query;

  const where: any = {};
  if (category) where.category = category;
  if (projectId) where.projectId = projectId;
  // Un client ne voit QUE ses propres documents, quoi qu'il demande.
  where.clientId = isAdmin ? (clientId || undefined) : req.user?.id;
  if (where.clientId === undefined) delete where.clientId;

  const documents = await Document.findAll({ where, include: includes, order: [['createdAt', 'DESC']] });
  return sendResponse(res, { data: documents });
});

// POST /api/v1/documents (admin) — le fichier est d'abord envoyé via /uploads
export const createDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = documentSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  const client = await User.findByPk(parsed.data.clientId);
  if (!client) return sendError(res, '31', 'Client non trouvé');

  const document = await Document.create({ ...parsed.data, uploadedById: req.user?.id } as any);

  await notify({
    userId: document.clientId,
    title: 'Nouveau document disponible',
    message: document.name,
    type: 'PROJECT',
    link: '/client/documents',
  });

  const full = await Document.findByPk(document.id, { include: includes });
  return sendResponse(res, { responseCode: '01', data: full });
});

// PATCH /api/v1/documents/:id (admin)
export const updateDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const document = await Document.findByPk(String(req.params.id));
  if (!document) return sendError(res, '30', 'Document non trouvé');

  const parsed = documentSchema.partial().safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  await document.update(parsed.data as any);
  const full = await Document.findByPk(document.id, { include: includes });
  return sendResponse(res, { responseCode: '02', data: full });
});

// DELETE /api/v1/documents/:id (admin)
export const deleteDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const document = await Document.findByPk(String(req.params.id));
  if (!document) return sendError(res, '30', 'Document non trouvé');
  await document.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
