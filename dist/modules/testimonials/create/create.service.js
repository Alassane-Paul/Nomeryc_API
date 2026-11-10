"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestimonial = createTestimonial;
const testimonial_model_1 = require("../../../models/testimonial.model");
async function createTestimonial(data) {
    return testimonial_model_1.Testimonial.create(data);
}
