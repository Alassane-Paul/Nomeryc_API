import { Invoice, InvoiceItem } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { Quote } from '../../../models/quote.model';
import { UserRole } from '../../../enums/user.enum';

export async function getInvoiceService(id: string, userId?: string, role?: UserRole) {
  const where: any = { id };
  if (role !== UserRole.ADMIN) where.clientId = userId;
  return Invoice.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'company', 'phone'] },
      { model: Project, as: 'project' },
      { model: Quote, as: 'quote' },
      { model: InvoiceItem, as: 'items' },
    ],
  });
}
