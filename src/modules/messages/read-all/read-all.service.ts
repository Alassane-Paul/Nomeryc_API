import { Message } from '../../../models/message.model';
import { UserRole } from '../../../enums/user.enum';
import { emitToUser, emitToAdmins } from '../../../config/socket';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

export async function markAllMessagesReadService(user: NonNullable<AuthenticatedRequest['user']>, body: any, query: any) {
  if (user.role === UserRole.ADMIN) {
    const clientId = (body.clientId || query.clientId) as string | undefined;
    if (!clientId) return false;
    await Message.update({ isRead: true }, { where: { senderId: clientId, isRead: false } });
    emitToUser(clientId, 'message:read', { all: true });
  } else {
    await Message.update({ isRead: true }, { where: { recipientId: user.id, isRead: false } });
    emitToAdmins('message:read', { all: true, clientId: user.id });
  }
  return true;
}
