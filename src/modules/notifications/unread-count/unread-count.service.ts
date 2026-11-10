import { Notification } from '../../../models/notification.model';

export async function countUnreadNotificationsService(userId?: string) {
  return Notification.count({ where: { userId, isRead: false } });
}
