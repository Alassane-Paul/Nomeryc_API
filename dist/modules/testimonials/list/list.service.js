"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTestimonials = listTestimonials;
const testimonial_model_1 = require("../../../models/testimonial.model");
async function listTestimonials() {
    return testimonial_model_1.Testimonial.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
}
