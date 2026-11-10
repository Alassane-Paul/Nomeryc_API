import { Invoice } from '../../../models/invoice.model';

export async function updateInvoiceService(id: string, body: any) {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return null;
  await invoice.update(body);
  return invoice;
}
