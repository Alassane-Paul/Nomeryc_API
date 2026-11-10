import { Invoice } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { InvoiceStatus } from '../../../enums/invoice.enum';
import { UserRole as Role } from '../../../enums/user.enum';
import { sendMail, mailTemplates } from '../../../services/mail.service';
import { notify } from '../../../services/notification.service';
import { UserRole } from '../../../enums/user.enum';

export async function markInvoicePaidService(id: string, userId: string | undefined, role: UserRole | undefined, body: any) {
  const where: any = { id };
  const isAdmin = role === UserRole.ADMIN;
  if (!isAdmin) where.clientId = userId;
  const invoice = await Invoice.findOne({ where });
  if (!invoice) return { invoice: null };
  await invoice.update({
    status: InvoiceStatus.PAYE, paidAt: new Date(), paymentMethod: body.paymentMethod,
    stripePaymentIntentId: body.stripePaymentIntentId,
  });
  const client = await User.findByPk(invoice.clientId);
  if (client) {
    const mail = mailTemplates.invoicePaid(client.firstName, invoice.invoiceNumber, invoice.totalTTC);
    sendMail({ to: client.email, ...mail });
  }
  if (!isAdmin) {
    const admins = await User.findAll({ where: { role: Role.ADMIN }, attributes: ['id'] });
    admins.forEach((admin) => notify({
      userId: admin.id, title: 'Paiement reçu',
      message: `Facture ${invoice.invoiceNumber} marquée comme payée`,
      type: 'INVOICE', link: '/admin/factures',
    }));
  }
  return { invoice };
}
