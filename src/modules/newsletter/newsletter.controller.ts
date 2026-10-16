import { Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { NewsletterSubscriber } from '../../models/newsletterSubscriber.model';
import { sendResponse, sendError } from '../../utils/response';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendMail, mailTemplates } from '../../services/mail.service';

const subscribeSchema = z.object({
  email: z.string().email('Email invalide'),
});

// POST /api/v1/newsletter/subscribe
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Email invalide');

  const { email } = parsed.data;

  const existing = await NewsletterSubscriber.findOne({ where: { email } });
  if (existing) {
    if (!existing.isActive) {
      await existing.update({ isActive: true });
    }
    // Idempotent : on ne renvoie pas d'erreur si déjà inscrit, mais pas de mail non plus.
    return sendResponse(res, { responseCode: '00', responseMessage: 'Vous êtes déjà inscrit à la newsletter.', data: null });
  }

  const unsubscribeToken = crypto.randomBytes(24).toString('hex');
  await NewsletterSubscriber.create({ email, unsubscribeToken, isActive: true });

  const mail = mailTemplates.newsletterWelcome();
  sendMail({ to: email, ...mail }); // fire-and-forget : ne bloque jamais la confirmation d'inscription

  return sendResponse(res, { responseCode: '01', responseMessage: 'Inscription réussie !', data: null });
});

// POST /api/v1/newsletter/unsubscribe  body: { token }
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const token = String(req.body.token || req.query.token || '');
  if (!token) return sendError(res, '11', 'Token requis');

  const subscriber = await NewsletterSubscriber.findOne({ where: { unsubscribeToken: token } });
  if (!subscriber) return sendError(res, '30', 'Abonnement introuvable');

  await subscriber.update({ isActive: false });
  return sendResponse(res, { responseCode: '00', responseMessage: 'Désabonnement effectué.', data: null });
});
