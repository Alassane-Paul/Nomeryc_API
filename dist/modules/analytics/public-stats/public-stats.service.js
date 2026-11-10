"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicStatsService = getPublicStatsService;
const project_model_1 = require("../../../models/project.model");
const user_model_1 = require("../../../models/user.model");
const testimonial_model_1 = require("../../../models/testimonial.model");
const teamMember_model_1 = require("../../../models/teamMember.model");
const projet_enum_1 = require("../../../enums/projet.enum");
const user_enum_1 = require("../../../enums/user.enum");
async function getPublicStatsService() {
    const [projectsDelivered, clientsCount, teamSize, testimonials] = await Promise.all([
        project_model_1.Project.count({ where: { status: projet_enum_1.ProjectStatus.TERMINE } }),
        user_model_1.User.count({ where: { role: user_enum_1.UserRole.CLIENT } }),
        teamMember_model_1.TeamMember.count(),
        testimonial_model_1.Testimonial.findAll({ attributes: ['rating'], where: { isPublic: true } }),
    ]);
    const ratings = testimonials.map((testimonial) => testimonial.rating).filter((rating) => typeof rating === 'number');
    const averageRating = ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;
    return { projectsDelivered, clientsCount, teamSize, averageRating, reviewsCount: ratings.length };
}
