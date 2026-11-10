import { Faq } from '../../../models/faq.model';

export async function createFaqService(data: any) {
  return Faq.create(data);
}
