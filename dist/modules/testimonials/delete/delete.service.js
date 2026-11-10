"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = deleteTestimonial;
const testimonial_model_1 = require("../../../models/testimonial.model");
async function deleteTestimonial(id) {
    const item = await testimonial_model_1.Testimonial.findByPk(id);
    if (!item)
        return false;
    await item.destroy();
    return true;
}
