import { PricingPlan } from '../../../models/pricingPlan.model';

export async function getPricingPlan(id: string) {
  return PricingPlan.findByPk(id);
}
