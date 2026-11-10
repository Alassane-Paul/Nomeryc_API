import { ContactRequest } from '../../../models/contactRequest.model';

export async function updateContactStatusService(id: string, data: any) {
  const contact = await ContactRequest.findByPk(id);
  if (!contact) return null;
  await contact.update({ status: data.status, notes: data.notes, assignedTo: data.assignedTo });
  return contact;
}
