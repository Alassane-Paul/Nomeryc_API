import { Testimonial } from '../../../models/testimonial.model';

export async function listAllTestimonials() {
  return Testimonial.findAll({ order: [['orderIndex', 'ASC']] });
}
