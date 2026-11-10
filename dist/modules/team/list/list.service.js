"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTeamMembers = listTeamMembers;
const teamMember_model_1 = require("../../../models/teamMember.model");
async function listTeamMembers() {
    return teamMember_model_1.TeamMember.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
}
