import { Faq } from '../../../models/faq.model';

export async function getFaqService(id: string) {
  return Faq.findByPk(id);
}
