import { ContactRequest } from '../../../models/contactRequest.model';

export async function getContactRequestsService(status: unknown) {
  const where: any = {};
  if (status) where.status = status;
  return ContactRequest.findAll({ where, order: [['createdAt', 'DESC']] });
}
