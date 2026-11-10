import { PricingPlan } from '../../../models/pricingPlan.model';

export async function updatePricingPlan(id: string, data: any) {
  const item = await PricingPlan.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}
