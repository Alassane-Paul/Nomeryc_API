"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = exports.updateTeamMember = exports.createTeamMember = exports.getTeamMember = exports.getAllTeamMembers = exports.getTeamMembers = void 0;
const teamMember_model_1 = require("../../models/teamMember.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.getTeamMembers = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const members = await teamMember_model_1.TeamMember.findAll({
        where: { isPublic: true },
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
    });
    return (0, response_1.sendResponse)(res, { data: members });
});
exports.getAllTeamMembers = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const members = await teamMember_model_1.TeamMember.findAll({ order: [['orderIndex', 'ASC']] });
    return (0, response_1.sendResponse)(res, { data: members });
});
exports.getTeamMember = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const member = await teamMember_model_1.TeamMember.findByPk(String(req.params.id));
    if (!member)
        return (0, response_1.sendError)(res, '30', 'Membre introuvable');
    return (0, response_1.sendResponse)(res, { data: member });
});
exports.createTeamMember = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const member = await teamMember_model_1.TeamMember.create(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: member });
});
exports.updateTeamMember = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const member = await teamMember_model_1.TeamMember.findByPk(String(req.params.id));
    if (!member)
        return (0, response_1.sendError)(res, '30', 'Membre introuvable');
    await member.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: member });
});
exports.deleteTeamMember = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const member = await teamMember_model_1.TeamMember.findByPk(String(req.params.id));
    if (!member)
        return (0, response_1.sendError)(res, '30', 'Membre introuvable');
    await member.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
