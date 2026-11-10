import { PricingPlan } from '../../../models/pricingPlan.model';

export async function deletePricingPlan(id: string) {
  const item = await PricingPlan.findByPk(id);
  if (!item) return false;
  await item.destroy();
  return true;
}
