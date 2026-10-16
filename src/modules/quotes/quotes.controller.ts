import { Response } from 'express';
import { Quote } from '../../models/quote.model';
import { QuoteItem } from '../../models/quote.model';
import { User } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';
import { QuoteStatus } from '../../enums/quote.enum';
import { sendMail, mailTemplates } from '../../services/mail.service';
import { notify } from '../../services/notification.service';
import { streamDocumentPdf } from '../../services/pdf.service';
import { z } from 'zod';

const quoteItemSchema = z.object({
  designation: z.string(),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  unit: z.string().optional(),
});

const quoteSchema = z.object({
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  title: z.string().optional(),
  tvaRate: z.number().min(0).max(100).default(18),
  validUntil: z.string().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1),
});

function calculateQuoteTotals(items: z.infer<typeof quoteItemSchema>[], tvaRate: number) {
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

// GET /api/v1/quotes
export const getQuotes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const where = isAdmin ? {} : { clientId: req.user?.id };

  const quotes = await Quote.findAll({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] },
      { model: QuoteItem, as: 'items' },
    ],
    order: [['createdAt', 'DESC']],
  });

  return sendResponse(res, { data: quotes });
});

// GET /api/v1/quotes/:id
export const getQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const quote = await Quote.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'firstName', 'lastName', 'email', 'company', 'phone'] },
      { model: Project, as: 'project' },
      { model: QuoteItem, as: 'items' },
    ],
  });

  if (!quote) return sendError(res, '30', 'Devis non trouvé');
  return sendResponse(res, { data: quote });
});

// POST /api/v1/quotes (Admin only)
export const createQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  const { items, tvaRate, validUntil, ...quoteData } = parsed.data;
  const totals = calculateQuoteTotals(items, tvaRate);

  const quote = await Quote.create({
    ...quoteData,
    clientId: quoteData.clientId || req.user!.id,
    quoteNumber: generateQuoteNumber(),
    tvaRate,
    validUntil: validUntil ? new Date(validUntil) : undefined,
    ...totals,
    status: QuoteStatus.BROUILLON,
  });

  // Créer les lignes du devis
  await QuoteItem.bulkCreate(
    items.map(item => ({
      quoteId: quote.id,
      ...item,
      total: item.quantity * item.unitPrice,
    }))
  );

  const fullQuote = await Quote.findByPk(quote.id, {
    include: [{ model: QuoteItem, as: 'items' }],
  });

  // Le devis reste en BROUILLON : on ne notifie le client qu'à l'envoi (updateQuoteStatus → ENVOYE).

  return sendResponse(res, { responseCode: '01', data: fullQuote });
});

// PATCH /api/v1/quotes/:id/status (Client: accept/reject, Admin: any)
export const updateQuoteStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const quote = await Quote.findOne({ where });
  if (!quote) return sendError(res, '30', 'Devis non trouvé');

  const { status } = req.body;
  if (!Object.values(QuoteStatus).includes(status)) {
    return sendError(res, '10', 'Statut invalide');
  }

  // Le client ne peut qu'accepter ou refuser
  if (!isAdmin && ![QuoteStatus.ACCEPTE, QuoteStatus.REFUSE].includes(status)) {
    return sendError(res, '23', 'Action non autorisée');
  }

  await quote.update({ status });

  // Le client est prévenu quand le devis lui est envoyé.
  if (isAdmin && status === QuoteStatus.ENVOYE) {
    const client = await User.findByPk(quote.clientId);
    if (client) {
      const mail = mailTemplates.quoteSent(client.firstName, quote.quoteNumber, quote.totalTTC);
      sendMail({ to: client.email, ...mail });
      notify({
        userId: client.id,
        title: 'Nouveau devis disponible',
        message: `Devis ${quote.quoteNumber} — ${quote.totalTTC.toLocaleString('fr-FR')} FCFA`,
        type: 'QUOTE',
        link: '/client/devis',
      });
    }
  }

  // L'admin est prévenu quand un client accepte/refuse.
  if (!isAdmin) {
    const admins = await User.findAll({ where: { role: UserRole.ADMIN }, attributes: ['id'] });
    const label = status === QuoteStatus.ACCEPTE ? 'accepté' : 'refusé';
    admins.forEach((admin) =>
      notify({
        userId: admin.id,
        title: `Devis ${label}`,
        message: `Le devis ${quote.quoteNumber} a été ${label} par le client`,
        type: 'QUOTE',
        link: '/admin/devis',
      })
    );
  }

  return sendResponse(res, { responseCode: '02', data: quote });
});

// PATCH /api/v1/quotes/:id (Admin: update full quote)
export const updateQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const quote = await Quote.findByPk(String(req.params.id));
  if (!quote) return sendError(res, '30', 'Devis non trouvé');

  if (req.body.items) {
    const tvaRate = req.body.tvaRate || quote.tvaRate;
    const { totalHT, totalTVA, totalTTC } = calculateQuoteTotals(req.body.items, tvaRate);
    await QuoteItem.destroy({ where: { quoteId: quote.id } });
    await QuoteItem.bulkCreate(req.body.items.map((item: any) => ({
      quoteId: quote.id,
      ...item,
      total: item.quantity * item.unitPrice,
    })));
    await quote.update({ ...req.body, totalHT, totalTVA, totalTTC });
  } else {
    await quote.update(req.body);
  }

  return sendResponse(res, { responseCode: '02', data: quote });
});

// DELETE /api/v1/quotes/:id
export const deleteQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const quote = await Quote.findByPk(String(req.params.id));
  if (!quote) return sendError(res, '30', 'Devis non trouvé');
  await quote.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});

// GET /api/v1/quotes/:id/pdf
export const getQuotePdf = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  const where: any = { id };
  if (!isAdmin) where.clientId = req.user?.id;

  const quote = await Quote.findOne({
    where,
    include: [
      { model: User, as: 'client', attributes: ['firstName', 'lastName', 'email', 'company', 'phone'] },
      { model: QuoteItem, as: 'items' },
    ],
  });
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
