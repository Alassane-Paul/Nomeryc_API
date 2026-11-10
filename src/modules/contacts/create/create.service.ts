import { ContactRequest } from '../../../models/contactRequest.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';
import { sendMail, mailTemplates } from '../../../services/mail.service';
import { notifyMany } from '../../../services/notification.service';
import { z } from 'zod';
import { ServiceType } from '../../../enums/service.enum';

export const contactSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.nativeEnum(ServiceType).optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  message: z.string().min(10, 'Message trop court'),
});

export type ContactData = z.infer<typeof contactSchema>;

export async function createContactRequestService(data: ContactData) {
  const contact = await ContactRequest.create(data);

  const admins = await User.findAll({ where: { role: UserRole.ADMIN }, attributes: ['id', 'email'] });
  const mail = mailTemplates.contactReceived(data.name, data.email, data.message);
  admins.forEach((admin) => sendMail({ to: admin.email, ...mail }));
  notifyMany(admins.map((admin) => admin.id), {
    title: 'Nouvelle demande de contact',
    message: `${data.name} — ${data.message.slice(0, 80)}`,
    type: 'SYSTEM',
    link: '/admin/contacts',
  });

  return contact;
}
