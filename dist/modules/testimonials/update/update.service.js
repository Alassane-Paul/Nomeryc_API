"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonial = updateTestimonial;
const testimonial_model_1 = require("../../../models/testimonial.model");
async function updateTestimonial(id, data) {
    const item = await testimonial_model_1.Testimonial.findByPk(id);
    if (!item)
        return null;
    await item.update(data);
    return item;
}
