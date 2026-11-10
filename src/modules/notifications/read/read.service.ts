import { Notification } from '../../../models/notification.model';

export async function markNotificationReadService(id: string, userId?: string) {
  const notification = await Notification.findOne({ where: { id, userId } });
  if (!notification) return null;
  await notification.update({ isRead: true });
  return notification;
}
