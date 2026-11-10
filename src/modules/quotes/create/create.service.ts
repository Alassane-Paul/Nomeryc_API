import { z } from 'zod';
import { Quote, QuoteItem } from '../../../models/quote.model';
import { QuoteStatus } from '../../../enums/quote.enum';

const quoteItemSchema = z.object({
  designation: z.string(),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  unit: z.string().optional(),
});

export const quoteSchema = z.object({
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  title: z.string().optional(),
  tvaRate: z.number().min(0).max(100).default(18),
  validUntil: z.string().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1),
});

export type QuoteData = z.infer<typeof quoteSchema>;

function calculateQuoteTotals(items: QuoteData['items'], tvaRate: number) {
  const totalHT = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalTVA = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + totalTVA;
  return { totalHT, totalTVA, totalTTC };
}

function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `DEV-${year}${month}-${rand}`;
}

export async function createQuote(data: QuoteData, userId: string) {
  const { items, tvaRate, validUntil, ...quoteData } = data;
  const totals = calculateQuoteTotals(items, tvaRate);
  const quote = await Quote.create({
    ...quoteData,
    clientId: quoteData.clientId || userId,
    quoteNumber: generateQuoteNumber(),
    tvaRate,
    validUntil: validUntil ? new Date(validUntil) : undefined,
    ...totals,
    status: QuoteStatus.BROUILLON,
  });

  await QuoteItem.bulkCreate(items.map(item => ({
    quoteId: quote.id,
    ...item,
    total: item.quantity * item.unitPrice,
  })));

  return Quote.findByPk(quote.id, { include: [{ model: QuoteItem, as: 'items' }] });
}
