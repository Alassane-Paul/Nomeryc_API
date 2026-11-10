"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllPricingPlans = listAllPricingPlans;
const pricingPlan_model_1 = require("../../../models/pricingPlan.model");
async function listAllPricingPlans() {
    return pricingPlan_model_1.PricingPlan.findAll({ order: [['orderIndex', 'ASC']] });
}
