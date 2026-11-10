"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePricingPlan = deletePricingPlan;
const pricingPlan_model_1 = require("../../../models/pricingPlan.model");
async function deletePricingPlan(id) {
    const item = await pricingPlan_model_1.PricingPlan.findByPk(id);
    if (!item)
        return false;
    await item.destroy();
    return true;
}
