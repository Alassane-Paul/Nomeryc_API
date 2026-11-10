"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePricingPlan = updatePricingPlan;
const pricingPlan_model_1 = require("../../../models/pricingPlan.model");
async function updatePricingPlan(id, data) {
    const item = await pricingPlan_model_1.PricingPlan.findByPk(id);
    if (!item)
        return null;
    await item.update(data);
    return item;
}
