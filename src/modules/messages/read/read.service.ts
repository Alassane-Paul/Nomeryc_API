import { Message } from '../../../models/message.model';
import { UserRole } from '../../../enums/user.enum';
import { emitToUser } from '../../../config/socket';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

export async function markMessageReadService(id: string, user: NonNullable<AuthenticatedRequest['user']>) {
  const message = await Message.findByPk(id);
  if (!message) return 'missing' as const;
  const isAdmin = user.role === UserRole.ADMIN;
  const authorized = isAdmin ? message.senderId !== user.id : message.recipientId === user.id;
  if (!authorized) return 'forbidden' as const;
  await message.update({ isRead: true });
  emitToUser(message.senderId, 'message:read', { ids: [message.id] });
  return message;
}
