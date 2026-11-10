import { Testimonial } from '../../../models/testimonial.model';

export async function updateTestimonial(id: string, data: any) {
  const item = await Testimonial.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}
