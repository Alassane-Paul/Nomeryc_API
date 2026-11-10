import { Invoice } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { InvoiceStatus } from '../../../enums/invoice.enum';
import { UserRole } from '../../../enums/user.enum';
import { createStripeCheckoutSession, isStripeConfigured } from '../../../services/stripe.service';

export async function initStripePaymentService(id: string, userId?: string, role?: UserRole) {
  if (!isStripeConfigured()) return 'unconfigured' as const;
  const where: any = { id };
  if (role !== UserRole.ADMIN) where.clientId = userId;
  const invoice = await Invoice.findOne({ where });
  if (!invoice) return 'not-found' as const;
  if (invoice.status === InvoiceStatus.PAYE) return 'paid' as const;
  const client = await User.findByPk(invoice.clientId);
  if (!client) return 'client-not-found' as const;
  const url = await createStripeCheckoutSession({
    invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, amountFcfa: invoice.totalTTC, clientEmail: client.email,
  });
  return { url };
}
