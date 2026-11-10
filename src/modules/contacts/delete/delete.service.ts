import { ContactRequest } from '../../../models/contactRequest.model';

export async function deleteContactRequestService(id: string) {
  const contact = await ContactRequest.findByPk(id);
  if (!contact) return false;
  await contact.destroy();
  return true;
}
