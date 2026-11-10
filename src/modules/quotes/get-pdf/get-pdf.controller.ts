import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError } from '../../../utils/response';
import { streamDocumentPdf } from '../../../services/pdf.service';
import { getQuotePdf as getQuotePdfService } from './get-pdf.service';

export const getQuotePdf = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const quote = await getQuotePdfService(String(req.params.id), req.user?.id, req.user?.role);
  if (!quote) return sendError(res, '30', 'Devis non trouvé');
  streamDocumentPdf(res, {
    kind: 'Devis',
    number: quote.quoteNumber,
    date: quote.createdAt,
    validUntilOrDueDate: quote.validUntil,
    validUntilOrDueLabel: 'Valable jusqu\'au',
    status: quote.status,
    client: (quote as any).client,
    items: (quote as any).items,
    totalHT: quote.totalHT,
    totalTVA: quote.totalTVA,
    tvaRate: quote.tvaRate,
    totalTTC: quote.totalTTC,
    notes: quote.notes,
    terms: quote.terms,
  });
});
