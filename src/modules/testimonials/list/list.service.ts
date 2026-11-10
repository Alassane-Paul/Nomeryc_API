import { Testimonial } from '../../../models/testimonial.model';

export async function listTestimonials() {
  return Testimonial.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
}
