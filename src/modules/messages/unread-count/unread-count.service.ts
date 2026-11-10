import { Op } from 'sequelize';
import { UserRole } from '../../../enums/user.enum';
import { Message } from '../../../models/message.model';
import { User } from '../../../models/user.model';

export async function countUnreadMessagesService(userId: string, role?: UserRole): Promise<number> {
  if (role === UserRole.ADMIN) {
    const clients = await User.findAll({
      where: { role: UserRole.CLIENT },
      attributes: ['id'],
    });

    return Message.count({
      where: {
        senderId: { [Op.in]: clients.map((client) => client.id) },
        isRead: false,
      },
    });
  }

  return Message.count({
    where: {
      recipientId: userId,
      isRead: false,
    },
  });
}
