import { Notification, NotificationType } from '../models/notification.model';
import { emitToUser } from '../config/socket';

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

/**
 * Crée une notification en base ET la pousse en temps réel au destinataire.
 * Ne throw jamais : une notification ratée ne doit pas faire échouer l'action métier.
 */
export async function notify(input: CreateNotificationInput): Promise<Notification | null> {
  try {
    const notification = await Notification.create({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type || 'SYSTEM',
      link: input.link,
      isRead: false,
    });

    emitToUser(input.userId, 'notification:new', notification);
    return notification;
  } catch (error: any) {
    console.error('❌ Échec création notification :', error?.message);
    return null;
  }
}

/** Notifie plusieurs utilisateurs en parallèle. */
export async function notifyMany(userIds: string[], input: Omit<CreateNotificationInput, 'userId'>) {
  await Promise.all(userIds.map((userId) => notify({ ...input, userId })));
}
