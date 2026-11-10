import { PricingPlan } from '../../../models/pricingPlan.model';

export async function listAllPricingPlans() {
  return PricingPlan.findAll({ order: [['orderIndex', 'ASC']] });
}
