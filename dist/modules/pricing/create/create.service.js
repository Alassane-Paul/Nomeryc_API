"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPricingPlan = createPricingPlan;
const pricingPlan_model_1 = require("../../../models/pricingPlan.model");
async function createPricingPlan(data) {
    return pricingPlan_model_1.PricingPlan.create(data);
}
