import { Faq } from '../../../models/faq.model';

export async function getAllFaqsService() {
  return Faq.findAll({ order: [['orderIndex', 'ASC']] });
}
