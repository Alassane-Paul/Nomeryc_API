import { Invoice } from '../../models/invoice.model';
import { User } from '../../models/user.model';
import { InvoiceStatus, PaymentMethod } from '../../enums/invoice.enum';
import { sendMail, mailTemplates } from '../../services/mail.service';
import { notify } from '../../services/notification.service';
import { emitToUser, emitToAdmins } from '../../config/socket';
import { UserRole } from '../../enums/user.enum';

/**
 * Marque une facture comme payée et déclenche les mêmes effets de bord que
 * le paiement manuel admin (email, notification, temps réel) — appelée à la
 * fois par le webhook Stripe et le webhook FedaPay pour ne pas dupliquer la logique.
 */
export async function markInvoicePaidFromWebhook(
  invoiceId: string,
  paymentMethod: PaymentMethod,
  externalId?: { stripePaymentIntentId?: string; fedapayTransactionId?: string }
): Promise<void> {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) {
    console.error(`[payments] Webhook reçu pour une facture introuvable : ${invoiceId}`);
    return;
  }
  if (invoice.status === InvoiceStatus.PAYE) {
    return; // idempotence : déjà traité (webhooks peuvent être renvoyés plusieurs fois)
  }

  await invoice.update({
    status: InvoiceStatus.PAYE,
    paidAt: new Date(),
    paymentMethod,
    ...(externalId?.stripePaymentIntentId ? { stripePaymentIntentId: externalId.stripePaymentIntentId } : {}),
    ...(externalId?.fedapayTransactionId ? { fedapayTransactionId: externalId.fedapayTransactionId } : {}),
  });

  const client = await User.findByPk(invoice.clientId);
  if (client) {
    const mail = mailTemplates.invoicePaid(client.firstName, invoice.invoiceNumber, invoice.totalTTC);
    sendMail({ to: client.email, ...mail });
    emitToUser(client.id, 'invoice:paid', { id: invoice.id, invoiceNumber: invoice.invoiceNumber });
  }

  const admins = await User.findAll({ where: { role: UserRole.ADMIN }, attributes: ['id'] });
  admins.forEach((admin) =>
    notify({
      userId: admin.id,
      title: 'Paiement reçu',
      message: `Facture ${invoice.invoiceNumber} payée via ${paymentMethod}`,
      type: 'INVOICE',
      link: '/admin/factures',
    })
  );
  emitToAdmins('invoice:paid', { id: invoice.id, invoiceNumber: invoice.invoiceNumber });
}
