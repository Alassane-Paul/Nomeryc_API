import { Notification } from '../../../models/notification.model';

export async function deleteNotificationService(id: string, userId?: string) {
  return Notification.destroy({ where: { id, userId } });
}
