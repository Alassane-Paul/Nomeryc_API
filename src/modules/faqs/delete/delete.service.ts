import { Faq } from '../../../models/faq.model';

export async function deleteFaqService(id: string) {
  const item = await Faq.findByPk(id);
  if (!item) return false;
  await item.destroy();
  return true;
}
