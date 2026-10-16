import { Response, Request } from 'express';
import { ContactRequest } from '../../models/contactRequest.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { ServiceType } from '../../enums/service.enum';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { User } from '../../models/user.model';
import { UserRole } from '../../enums/user.enum';
import { sendMail, mailTemplates } from '../../services/mail.service';
import { notifyMany } from '../../services/notification.service';

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { responseCode: '98', responseMessage: 'Trop de messages envoyés, réessayez dans 1 heure.' },
});

const contactSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.nativeEnum(ServiceType).optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  message: z.string().min(10, 'Message trop court'),
});

export const createContactRequest = asyncHandler(async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  const contact = await ContactRequest.create(parsed.data);

  // Équipe prévenue par email + notification (ne bloque jamais la réponse au visiteur).
  const admins = await User.findAll({ where: { role: UserRole.ADMIN }, attributes: ['id', 'email'] });
  const mail = mailTemplates.contactReceived(parsed.data.name, parsed.data.email, parsed.data.message);
  admins.forEach((admin) => sendMail({ to: admin.email, ...mail }));
  notifyMany(admins.map((a) => a.id), {
    title: 'Nouvelle demande de contact',
    message: `${parsed.data.name} — ${parsed.data.message.slice(0, 80)}`,
    type: 'SYSTEM',
    link: '/admin/contacts',
  });

  return sendResponse(res, {
    responseCode: '01',
    responseMessage: 'Votre message a bien été envoyé. Nous vous contacterons bientôt !',
    data: { id: contact.id },
  });
});

export const getContactRequests = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query;
  const where: any = {};
  if (status) where.status = status;

  const contacts = await ContactRequest.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  return sendResponse(res, { data: contacts });
});

export const updateContactStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const contact = await ContactRequest.findByPk(String(req.params.id));
  if (!contact) return sendError(res, '30', 'Demande non trouvée');

  await contact.update({ status: req.body.status, notes: req.body.notes, assignedTo: req.body.assignedTo });
  return sendResponse(res, { responseCode: '02', data: contact });
});

export const deleteContactRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const contact = await ContactRequest.findByPk(String(req.params.id));
  if (!contact) return sendError(res, '30', 'Demande non trouvée');
  await contact.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
