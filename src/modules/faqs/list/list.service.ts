import { Faq } from '../../../models/faq.model';

export async function getFaqsService() {
  return Faq.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
}
