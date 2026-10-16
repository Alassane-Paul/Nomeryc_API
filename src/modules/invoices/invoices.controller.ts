import { Response, Request } from 'express';
import { Invoice, InvoiceItem } from '../../models/invoice.model';
import { User } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { Quote } from '../../models/quote.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';
import { InvoiceStatus } from '../../enums/invoice.enum';
import { UserRole as Role } from '../../enums/user.enum';
import { sendMail, mailTemplates } from '../../services/mail.service';
import { notify } from '../../services/notification.service';
import { streamDocumentPdf } from '../../services/pdf.service';

function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `FAC-${year}${month}-${rand}`;
}

export const getInvoices = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const where = isAdmin ? {} : { clientId: req.user?.id };

  const invoices = await Invoice.findAll({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  return sendResponse(res, { data: invoices });
});

export const getInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const invoice = await Invoice.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'company', 'phone'] },
      { model: Project, as: 'project' },
      { model: Quote, as: 'quote' },
      { model: InvoiceItem, as: 'items' },
    ],
  });

  if (!invoice) return sendError(res, '30', 'Facture non trouvée');
  return sendResponse(res, { data: invoice });
});

export const createInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { clientId, projectId, quoteId, items, tvaRate = 18, dueDate, ...rest } = req.body;

  const totalHT = (items || []).reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0);
  const totalTVA = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + totalTVA;

  const invoice = await Invoice.create({
    ...rest,
    clientId,
    projectId,
    quoteId,
    invoiceNumber: generateInvoiceNumber(),
    tvaRate,
    totalHT,
    totalTVA,
    totalTTC,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    status: InvoiceStatus.BROUILLON,
  });

  if (items?.length) {
    await InvoiceItem.bulkCreate(
      items.map((item: any) => ({
        invoiceId: invoice.id,
        ...item,
        total: item.quantity * item.unitPrice,
      }))
    );
  }

  const fullInvoice = await Invoice.findByPk(invoice.id, {
    include: [{ model: InvoiceItem, as: 'items' }],
  });

  const client = await User.findByPk(clientId);
  if (client) {
    const mail = mailTemplates.invoiceSent(client.firstName, invoice.invoiceNumber, invoice.totalTTC, invoice.dueDate);
    sendMail({ to: client.email, ...mail });
    notify({
      userId: client.id,
      title: 'Nouvelle facture',
      message: `Facture ${invoice.invoiceNumber} — ${invoice.totalTTC.toLocaleString('fr-FR')} FCFA`,
      type: 'INVOICE',
      link: '/client/factures',
    });
  }

  return sendResponse(res, { responseCode: '01', data: fullInvoice });
});

export const updateInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const invoice = await Invoice.findByPk(String(req.params.id));
  if (!invoice) return sendError(res, '30', 'Facture non trouvée');
  await invoice.update(req.body);
  return sendResponse(res, { responseCode: '02', data: invoice });
});

export const markAsPaid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const invoice = await Invoice.findOne({ where });
  if (!invoice) return sendError(res, '30', 'Facture non trouvée');

  await invoice.update({
    status: InvoiceStatus.PAYE,
    paidAt: new Date(),
    paymentMethod: req.body.paymentMethod,
    stripePaymentIntentId: req.body.stripePaymentIntentId,
  });

  const client = await User.findByPk(invoice.clientId);
  if (client) {
    const mail = mailTemplates.invoicePaid(client.firstName, invoice.invoiceNumber, invoice.totalTTC);
    sendMail({ to: client.email, ...mail });
  }
  if (!isAdmin) {
    const admins = await User.findAll({ where: { role: Role.ADMIN }, attributes: ['id'] });
    admins.forEach((admin) =>
      notify({
        userId: admin.id,
        title: 'Paiement reçu',
        message: `Facture ${invoice.invoiceNumber} marquée comme payée`,
        type: 'INVOICE',
        link: '/admin/factures',
      })
    );
  }

  return sendResponse(res, { responseCode: '02', responseMessage: 'Facture marquée comme payée', data: invoice });
});

export const deleteInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const invoice = await Invoice.findByPk(String(req.params.id));
  if (!invoice) return sendError(res, '30', 'Facture non trouvée');
  await invoice.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});

// GET /api/v1/invoices/:id/pdf
export const getInvoicePdf = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const invoice = await Invoice.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
      { model: InvoiceItem, as: 'items' },
    ],
  });
  if (!invoice) return sendError(res, '30', 'Facture non trouvée');

  streamDocumentPdf(res, {
    kind: 'Facture',
    number: invoice.invoiceNumber,
    date: invoice.createdAt,
    validUntilOrDueDate: invoice.dueDate,
    validUntilOrDueLabel: 'Échéance',
    status: invoice.status,
    client: (invoice as any).client,
    items: (invoice as any).items,
    totalHT: invoice.totalHT,
    totalTVA: invoice.totalTVA,
    tvaRate: invoice.tvaRate,
    totalTTC: invoice.totalTTC,
    notes: invoice.notes,
  });
});
