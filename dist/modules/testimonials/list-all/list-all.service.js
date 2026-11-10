"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllTestimonials = listAllTestimonials;
const testimonial_model_1 = require("../../../models/testimonial.model");
async function listAllTestimonials() {
    return testimonial_model_1.Testimonial.findAll({ order: [['orderIndex', 'ASC']] });
}
