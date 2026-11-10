import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError } from '../../../utils/response';
import { streamDocumentPdf } from '../../../services/pdf.service';
import { getInvoicePdfService } from './pdf.service';

export const getInvoicePdf = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const invoice = await getInvoicePdfService(String(req.params.id), req.user?.id, req.user?.role);
  if (!invoice) return sendError(res, '30', 'Facture non trouvée');
  streamDocumentPdf(res, {
    kind: 'Facture', number: invoice.invoiceNumber, date: invoice.createdAt,
    validUntilOrDueDate: invoice.dueDate, validUntilOrDueLabel: 'Échéance', status: invoice.status,
    client: (invoice as any).client, items: (invoice as any).items,
    totalHT: invoice.totalHT, totalTVA: invoice.totalTVA, tvaRate: invoice.tvaRate,
    totalTTC: invoice.totalTTC, notes: invoice.notes,
  });
});
