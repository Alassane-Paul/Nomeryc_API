import { Invoice } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { InvoiceStatus } from '../../../enums/invoice.enum';
import { UserRole } from '../../../enums/user.enum';
import { createFedapayTransaction, isFedapayConfigured } from '../../../services/fedapay.service';

export async function initFedapayPaymentService(id: string, userId?: string, role?: UserRole, body?: any) {
  if (!isFedapayConfigured()) return 'unconfigured' as const;
  const where: any = { id };
  if (role !== UserRole.ADMIN) where.clientId = userId;
  const invoice = await Invoice.findOne({ where });
  if (!invoice) return 'not-found' as const;
  if (invoice.status === InvoiceStatus.PAYE) return 'paid' as const;
  const client = await User.findByPk(invoice.clientId);
  if (!client) return 'client-not-found' as const;
  try {
    const { transactionId, url } = await createFedapayTransaction({
      invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, amountFcfa: invoice.totalTTC,
      client: { firstName: client.firstName, lastName: client.lastName, email: client.email, phone: body?.phone || client.phone },
    });
    await invoice.update({ fedapayTransactionId: transactionId } as any);
    return { url };
  } catch (err: any) {
    console.error('[fedapay] Erreur création transaction:', err?.message || err);
    return 'transaction-error' as const;
  }
}
