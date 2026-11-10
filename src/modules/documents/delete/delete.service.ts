import { Document } from '../../../models/document.model';

export async function deleteDocumentService(id: string) {
  const document = await Document.findByPk(id);
  if (!document) return false;
  await document.destroy();
  return true;
}
