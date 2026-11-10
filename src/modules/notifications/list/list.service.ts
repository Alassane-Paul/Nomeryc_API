import { Notification } from '../../../models/notification.model';

export async function listNotificationsService(userId: string | undefined, query: any) {
  const { unread, type } = query;
  const where: any = { userId };
  if (unread === 'true') where.isRead = false;
  if (type) where.type = type;
  return Notification.findAll({ where, order: [['createdAt', 'DESC']], limit: 100 });
}
