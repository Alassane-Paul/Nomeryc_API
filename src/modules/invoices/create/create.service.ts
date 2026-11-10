import { Invoice, InvoiceItem } from '../../../models/invoice.model';
import { User } from '../../../models/user.model';
import { InvoiceStatus } from '../../../enums/invoice.enum';
import { sendMail, mailTemplates } from '../../../services/mail.service';
import { notify } from '../../../services/notification.service';

function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `FAC-${year}${month}-${rand}`;
}

export async function createInvoiceService(body: any) {
  const { clientId, projectId, quoteId, items, tvaRate = 18, dueDate, ...rest } = body;
  const totalHT = (items || []).reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0);
  const totalTVA = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + totalTVA;
  const invoice = await Invoice.create({
    ...rest, clientId, projectId, quoteId, invoiceNumber: generateInvoiceNumber(), tvaRate,
    totalHT, totalTVA, totalTTC, dueDate: dueDate ? new Date(dueDate) : undefined, status: InvoiceStatus.BROUILLON,
  });
  if (items?.length) {
    await InvoiceItem.bulkCreate(items.map((item: any) => ({
      invoiceId: invoice.id, ...item, total: item.quantity * item.unitPrice,
    })));
  }
  const fullInvoice = await Invoice.findByPk(invoice.id, { include: [{ model: InvoiceItem, as: 'items' }] });
  const client = await User.findByPk(clientId);
  if (client) {
    const mail = mailTemplates.invoiceSent(client.firstName, invoice.invoiceNumber, invoice.totalTTC, invoice.dueDate);
    sendMail({ to: client.email, ...mail });
    notify({
      userId: client.id, title: 'Nouvelle facture',
      message: `Facture ${invoice.invoiceNumber} — ${invoice.totalTTC.toLocaleString('fr-FR')} FCFA`,
      type: 'INVOICE', link: '/client/factures',
    });
  }
  return fullInvoice;
}
