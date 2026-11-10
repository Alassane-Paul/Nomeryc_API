import { Message } from '../../../models/message.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';
import { emitToUser, emitToAdmins } from '../../../config/socket';
import { notify, notifyMany } from '../../../services/notification.service';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

const senderInclude = { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };

export async function sendMessageService(user: NonNullable<AuthenticatedRequest['user']>, body: any) {
  const isAdmin = user.role === UserRole.ADMIN;
  const { projectId, content, attachments } = body;
  let recipientId: string | null = body.recipientId || null;
  if (!content || content.trim().length === 0) return { error: 'Le message ne peut pas être vide' };
  if (isAdmin) {
    if (!recipientId) return { error: 'recipientId requis : un admin doit préciser le client destinataire' };
    const client = await User.findByPk(recipientId);
    if (!client || client.role !== UserRole.CLIENT) return { error: 'Destinataire invalide' };
  } else recipientId = null;
  const message = await Message.create({
    senderId: user.id, projectId, recipientId: recipientId ?? undefined,
    content: content.trim(), attachments, isRead: false,
  });
  const fullMessage = await Message.findByPk(message.id, { include: [senderInclude, recipientInclude] });
  if (isAdmin) {
    emitToUser(recipientId!, 'message:new', fullMessage);
    emitToAdmins('message:new', fullMessage);
    notify({ userId: recipientId!, title: 'Nouveau message', message: content.trim().slice(0, 100), type: 'MESSAGE', link: '/client/messages' });
  } else {
    emitToAdmins('message:new', fullMessage);
    const admins = await User.findAll({ where: { role: UserRole.ADMIN }, attributes: ['id'] });
    notifyMany(admins.map((a) => a.id), {
      title: 'Nouveau message client', message: content.trim().slice(0, 100), type: 'MESSAGE', link: '/admin/messages',
    });
  }
  return { message: fullMessage };
}
