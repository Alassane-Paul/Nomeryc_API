"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamMember = updateTeamMember;
const teamMember_model_1 = require("../../../models/teamMember.model");
async function updateTeamMember(id, data) {
    const member = await teamMember_model_1.TeamMember.findByPk(id);
    if (!member)
        return null;
    await member.update(data);
    return member;
}
