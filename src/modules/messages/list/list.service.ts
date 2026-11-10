import { Op } from 'sequelize';
import { Message } from '../../../models/message.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

const senderInclude = { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };
const recipientInclude = { model: User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'avatar', 'role'] };

export async function listMessagesService(userId: string | undefined, role: UserRole | undefined, query: any) {
  const isAdmin = role === UserRole.ADMIN;
  const { projectId, clientId } = query;
  let where: any;
  if (projectId) where = { projectId };
  else if (isAdmin) {
    if (!clientId) return { error: 'clientId requis pour un admin (ou utilisez /messages/conversations)' };
    where = { [Op.or]: [{ senderId: clientId }, { recipientId: clientId }] };
  } else {
    where = { [Op.or]: [{ senderId: userId }, { recipientId: userId }] };
  }
  const messages = await Message.findAll({ where, include: [senderInclude, recipientInclude], order: [['createdAt', 'ASC']] });
  return { messages };
}
