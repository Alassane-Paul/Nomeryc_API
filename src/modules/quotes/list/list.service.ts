import { Quote } from '../../../models/quote.model';
import { QuoteItem } from '../../../models/quote.model';
import { User } from '../../../models/user.model';
import { Project } from '../../../models/project.model';
import { UserRole } from '../../../enums/user.enum';

export async function listQuotes(userId: string | undefined, role: UserRole | undefined) {
  const where = role === UserRole.ADMIN ? {} : { clientId: userId };
  return Quote.findAll({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] },
      { model: QuoteItem, as: 'items' },
    ],
    order: [['createdAt', 'DESC']],
  });
}
