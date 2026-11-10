import { Testimonial } from '../../../models/testimonial.model';

export async function deleteTestimonial(id: string) {
  const item = await Testimonial.findByPk(id);
  if (!item) return false;
  await item.destroy();
  return true;
}
