import { Quote } from '../../../models/quote.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';
import { QuoteStatus } from '../../../enums/quote.enum';
import { sendMail, mailTemplates } from '../../../services/mail.service';
import { notify } from '../../../services/notification.service';

export async function updateQuoteStatus(
  id: string,
  userId: string | undefined,
  role: UserRole | undefined,
  status: any,
) {
  const isAdmin = role === UserRole.ADMIN;
  const where: any = { id };
  if (!isAdmin) where.clientId = userId;
  const quote = await Quote.findOne({ where });
  if (!quote) return { error: 'not-found' as const };
  if (!Object.values(QuoteStatus).includes(status)) return { error: 'invalid-status' as const };
  if (!isAdmin && ![QuoteStatus.ACCEPTE, QuoteStatus.REFUSE].includes(status)) {
    return { error: 'forbidden' as const };
  }

  await quote.update({ status });
  if (isAdmin && status === QuoteStatus.ENVOYE) {
    const client = await User.findByPk(quote.clientId);
    if (client) {
      const mail = mailTemplates.quoteSent(client.firstName, quote.quoteNumber, quote.totalTTC);
      sendMail({ to: client.email, ...mail });
      notify({
        userId: client.id,
        title: 'Nouveau devis disponible',
        message: `Devis ${quote.quoteNumber} — ${quote.totalTTC.toLocaleString('fr-FR')} FCFA`,
        type: 'QUOTE',
        link: '/client/devis',
      });
    }
  }
  if (!isAdmin) {
    const admins = await User.findAll({ where: { role: UserRole.ADMIN }, attributes: ['id'] });
    const label = status === QuoteStatus.ACCEPTE ? 'accepté' : 'refusé';
    admins.forEach(admin =>
      notify({
        userId: admin.id,
        title: `Devis ${label}`,
        message: `Le devis ${quote.quoteNumber} a été ${label} par le client`,
        type: 'QUOTE',
        link: '/admin/devis',
      })
    );
  }
  return { quote };
}
