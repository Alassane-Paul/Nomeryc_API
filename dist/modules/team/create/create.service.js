"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamMember = createTeamMember;
const teamMember_model_1 = require("../../../models/teamMember.model");
async function createTeamMember(data) {
    return teamMember_model_1.TeamMember.create(data);
}
