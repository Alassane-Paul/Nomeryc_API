import { Notification } from '../../../models/notification.model';

export async function markAllNotificationsReadService(userId?: string) {
  return Notification.update({ isRead: true }, { where: { userId, isRead: false } });
}
