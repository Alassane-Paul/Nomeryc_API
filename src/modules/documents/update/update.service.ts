import { z } from 'zod';
import { Document } from '../../../models/document.model';
import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { DocumentCategory } from '../../../enums/document.enum';

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

export async function updateDocumentService(id: string, body: unknown) {
  const document = await Document.findByPk(id);
  if (!document) return { error: 'not-found' as const };

  const parsed = documentSchema.partial().safeParse(body);
  if (!parsed.success) return { error: 'invalid' as const, details: parsed.error.flatten() };

  await document.update(parsed.data as any);
  const full = await Document.findByPk(document.id, { include: includes });
  return { document: full };
}
