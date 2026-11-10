import { PricingPlan } from '../../../models/pricingPlan.model';

export async function createPricingPlan(data: any) {
  return PricingPlan.create(data);
}
