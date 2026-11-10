import { Project } from '../../../models/project.model';
import { User } from '../../../models/user.model';
import { Quote } from '../../../models/quote.model';
import { Invoice } from '../../../models/invoice.model';
import { UserRole } from '../../../enums/user.enum';

export async function getProject(id: string, userId: string | undefined, role: UserRole | undefined) {
  const where: any = { id };
  if (role !== UserRole.ADMIN) where.clientId = userId;
  return Project.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] },
      { model: Quote, as: 'quotes' },
      { model: Invoice, as: 'invoices' },
    ],
  });
}
