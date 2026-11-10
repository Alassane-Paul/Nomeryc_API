import { Faq } from '../../../models/faq.model';

export async function updateFaqService(id: string, data: any) {
  const item = await Faq.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}
