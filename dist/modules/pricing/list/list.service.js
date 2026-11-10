"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPricingPlans = listPricingPlans;
const pricingPlan_model_1 = require("../../../models/pricingPlan.model");
async function listPricingPlans() {
    return pricingPlan_model_1.PricingPlan.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
}
