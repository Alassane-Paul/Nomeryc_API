import { Message } from '../../../models/message.model';
import { emitToAdmins, emitToUser } from '../../../config/socket';

export async function deleteMessageService(id: string, userId?: string) {
  const message = await Message.findOne({ where: { id, senderId: userId } });
  if (!message) return false;
  const { id: messageId, recipientId } = message;
  await message.destroy();
  emitToAdmins('message:deleted', { id: messageId });
  if (recipientId) emitToUser(recipientId, 'message:deleted', { id: messageId });
  return true;
}
