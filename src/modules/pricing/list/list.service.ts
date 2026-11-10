import { PricingPlan } from '../../../models/pricingPlan.model';

export async function listPricingPlans() {
  return PricingPlan.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
}
