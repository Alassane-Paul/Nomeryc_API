import { Testimonial } from '../../../models/testimonial.model';

export async function createTestimonial(data: any) {
  return Testimonial.create(data);
}
