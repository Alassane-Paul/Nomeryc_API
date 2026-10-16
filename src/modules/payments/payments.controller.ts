import { Response } from 'express';
import { Invoice } from '../../models/invoice.model';
import { User } from '../../models/user.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';
import { InvoiceStatus } from '../../enums/invoice.enum';
import { createStripeCheckoutSession, isStripeConfigured } from '../../services/stripe.service';
import { createFedapayTransaction, isFedapayConfigured } from '../../services/fedapay.service';

async function findPayableInvoice(req: AuthenticatedRequest, res: Response): Promise<Invoice | null> {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const invoice = await Invoice.findOne({ where });
  if (!invoice) {
    sendError(res, '30', 'Facture non trouvée');
    return null;
  }
  if (invoice.status === InvoiceStatus.PAYE) {
    sendError(res, '12', 'Cette facture est déjà payée');
    return null;
  }
  return invoice;
}

// POST /api/v1/payments/stripe/:id
export const initStripePayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isStripeConfigured()) return sendError(res, '99', 'Le paiement par carte n\'est pas encore configuré.');

  const invoice = await findPayableInvoice(req, res);
  if (!invoice) return;

  const client = await User.findByPk(invoice.clientId);
  if (!client) return sendError(res, '30', 'Client introuvable');

  const url = await createStripeCheckoutSession({
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    amountFcfa: invoice.totalTTC,
    clientEmail: client.email,
  });

  return sendResponse(res, { data: { url } });
});

// POST /api/v1/payments/fedapay/:id  body: { phone? }
export const initFedapayPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isFedapayConfigured()) return sendError(res, '99', 'Le paiement Mobile Money n\'est pas encore configuré.');

  const invoice = await findPayableInvoice(req, res);
  if (!invoice) return;

  const client = await User.findByPk(invoice.clientId);
  if (!client) return sendError(res, '30', 'Client introuvable');

  try {
    const { transactionId, url } = await createFedapayTransaction({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amountFcfa: invoice.totalTTC,
      client: { firstName: client.firstName, lastName: client.lastName, email: client.email, phone: req.body.phone || client.phone },
    });

    await invoice.update({ fedapayTransactionId: transactionId } as any);

    return sendResponse(res, { data: { url } });
  } catch (err: any) {
    console.error('[fedapay] Erreur création transaction:', err?.message || err);
    return sendError(res, '99', 'Impossible de créer la transaction Mobile Money pour le moment.');
  }
});
