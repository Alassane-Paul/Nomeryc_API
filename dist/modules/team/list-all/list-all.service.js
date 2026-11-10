"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllTeamMembers = listAllTeamMembers;
const teamMember_model_1 = require("../../../models/teamMember.model");
async function listAllTeamMembers() {
    return teamMember_model_1.TeamMember.findAll({ order: [['orderIndex', 'ASC']] });
}
