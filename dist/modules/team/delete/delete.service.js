"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = deleteTeamMember;
const teamMember_model_1 = require("../../../models/teamMember.model");
async function deleteTeamMember(id) {
    const member = await teamMember_model_1.TeamMember.findByPk(id);
    if (!member)
        return false;
    await member.destroy();
    return true;
}
