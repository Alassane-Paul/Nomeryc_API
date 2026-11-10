import { Message } from '../../../models/message.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

const senderInclude = { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };

export async function listConversationsService() {
  const messages = await Message.findAll({ include: [senderInclude, recipientInclude], order: [['createdAt', 'DESC']] });
  const conversations = new Map<string, { client: any; lastMessage: Message; unreadCount: number }>();
  for (const msg of messages as any[]) {
    const client = msg.sender?.role === UserRole.CLIENT ? msg.sender : msg.recipient?.role === UserRole.CLIENT ? msg.recipient : null;
    if (!client) continue;
    if (!conversations.has(client.id)) conversations.set(client.id, { client, lastMessage: msg, unreadCount: 0 });
    if (msg.senderId === client.id && !msg.isRead) conversations.get(client.id)!.unreadCount += 1;
  }
  return Array.from(conversations.values());
}
