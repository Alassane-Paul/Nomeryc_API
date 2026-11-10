"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricingPlan = getPricingPlan;
const pricingPlan_model_1 = require("../../../models/pricingPlan.model");
async function getPricingPlan(id) {
    return pricingPlan_model_1.PricingPlan.findByPk(id);
}
