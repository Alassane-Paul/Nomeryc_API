import { Quote } from '../../../models/quote.model';
import { QuoteItem } from '../../../models/quote.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

export async function getQuotePdf(id: string, userId: string | undefined, role: UserRole | undefined) {
  const where: any = { id };
  if (role !== UserRole.ADMIN) where.clientId = userId;
  return Quote.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
      { model: QuoteItem, as: 'items' },
    ],
  });
}
