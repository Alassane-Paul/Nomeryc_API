import { Quote, QuoteItem } from '../../../models/quote.model';

function calculateQuoteTotals(items: any[], tvaRate: number) {
  const totalHT = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalTVA = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + totalTVA;
  return { totalHT, totalTVA, totalTTC };
}

export async function updateQuote(id: string, data: any) {
  const quote = await Quote.findByPk(id);
  if (!quote) return null;

  if (data.items) {
    const tvaRate = data.tvaRate || quote.tvaRate;
    const { totalHT, totalTVA, totalTTC } = calculateQuoteTotals(data.items, tvaRate);
    await QuoteItem.destroy({ where: { quoteId: quote.id } });
    await QuoteItem.bulkCreate(data.items.map((item: any) => ({
      quoteId: quote.id,
      ...item,
      total: item.quantity * item.unitPrice,
    })));
    await quote.update({ ...data, totalHT, totalTVA, totalTTC });
  } else {
    await quote.update(data);
  }
  return quote;
}
