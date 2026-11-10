import { Testimonial } from '../../../models/testimonial.model';

export async function getTestimonial(id: string) {
  return Testimonial.findByPk(id);
}
