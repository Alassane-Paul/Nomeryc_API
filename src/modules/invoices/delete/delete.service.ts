import { Invoice } from '../../../models/invoice.model';

export async function deleteInvoiceService(id: string) {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return false;
  await invoice.destroy();
  return true;
}
