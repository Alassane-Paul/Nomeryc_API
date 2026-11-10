"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestimonial = getTestimonial;
const testimonial_model_1 = require("../../../models/testimonial.model");
async function getTestimonial(id) {
    return testimonial_model_1.Testimonial.findByPk(id);
}
