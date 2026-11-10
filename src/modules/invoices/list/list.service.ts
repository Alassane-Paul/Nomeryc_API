import { Invoice } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { UserRole } from '../../../enums/user.enum';

export async function listInvoicesService(userId?: string, role?: UserRole) {
  const where = role === UserRole.ADMIN ? {} : { clientId: userId };
  return Invoice.findAll({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] },
    ],
    order: [['createdAt', 'DESC']],
  });
}
