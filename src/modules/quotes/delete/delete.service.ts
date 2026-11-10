import { Quote } from '../../../models/quote.model';

export async function deleteQuote(id: string) {
  const quote = await Quote.findByPk(id);
  if (!quote) return false;
  await quote.destroy();
  return true;
}
