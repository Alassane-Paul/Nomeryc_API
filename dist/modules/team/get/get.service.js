"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamMember = getTeamMember;
const teamMember_model_1 = require("../../../models/teamMember.model");
async function getTeamMember(id) {
    return teamMember_model_1.TeamMember.findByPk(id);
}
