import { Invoice, InvoiceItem } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

export async function getInvoicePdfService(id: string, userId?: string, role?: UserRole) {
  const where: any = { id };
  if (role !== UserRole.ADMIN) where.clientId = userId;
  return Invoice.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
      { model: InvoiceItem, as: 'items' },
    ],
  });
}
