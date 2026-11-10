import { NewsletterSubscriber } from '../../../models/newsletterSubscriber.model';

export async function unsubscribeService(body: any, query: any) {
  const token = String(body.token || query.token || '');
  if (!token) return 'missing-token' as const;
  const subscriber = await NewsletterSubscriber.findOne({ where: { unsubscribeToken: token } });
  if (!subscriber) return 'not-found' as const;
  await subscriber.update({ isActive: false });
  return 'ok' as const;
}
