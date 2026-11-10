import { z } from 'zod';
import { Document } from '../../../models/document.model';
import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { DocumentCategory } from '../../../enums/document.enum';
import { notify } from '../../../services/notification.service';

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

export async function createDocumentService(body: unknown, uploadedById?: string) {
  const parsed = documentSchema.safeParse(body);
  if (!parsed.success) return { error: 'invalid' as const, details: parsed.error.flatten() };

  const client = await User.findByPk(parsed.data.clientId);
  if (!client) return { error: 'client-not-found' as const };

  const document = await Document.create({ ...parsed.data, uploadedById } as any);

  await notify({
    userId: document.clientId,
    title: 'Nouveau document disponible',
    message: document.name,
    type: 'PROJECT',
    link: '/client/documents',
  });

  const full = await Document.findByPk(document.id, { include: includes });
  return { document: full };
}
