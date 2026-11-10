import crypto from 'crypto';
import { z } from 'zod';
import { NewsletterSubscriber } from '../../../models/newsletterSubscriber.model';
import { sendMail, mailTemplates } from '../../../services/mail.service';

const subscribeSchema = z.object({ email: z.string().email('Email invalide') });

export async function subscribeService(body: any) {
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) return { error: true as const };
  const { email } = parsed.data;
  const existing = await NewsletterSubscriber.findOne({ where: { email } });
  if (existing) {
    if (!existing.isActive) await existing.update({ isActive: true });
    return { alreadySubscribed: true as const };
  }
  const unsubscribeToken = crypto.randomBytes(24).toString('hex');
  await NewsletterSubscriber.create({ email, unsubscribeToken, isActive: true });
  const mail = mailTemplates.newsletterWelcome();
  sendMail({ to: email, ...mail });
  return { alreadySubscribed: false as const };
}
