import { Response, Request } from 'express';
import { TeamMember } from '../../models/teamMember.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';

export const getTeamMembers = asyncHandler(async (_req: Request, res: Response) => {
  const members = await TeamMember.findAll({
    where: { isPublic: true },
    order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
  });
  return sendResponse(res, { data: members });
});

export const getAllTeamMembers = asyncHandler(async (_req: Request, res: Response) => {
  const members = await TeamMember.findAll({ order: [['orderIndex', 'ASC']] });
  return sendResponse(res, { data: members });
});

export const getTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await TeamMember.findByPk(String(req.params.id));
  if (!member) return sendError(res, '30', 'Membre introuvable');
  return sendResponse(res, { data: member });
});

export const createTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const member = await TeamMember.create(req.body);
  return sendResponse(res, { responseCode: '01', data: member });
});

export const updateTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const member = await TeamMember.findByPk(String(req.params.id));
  if (!member) return sendError(res, '30', 'Membre introuvable');
  await member.update(req.body);
  return sendResponse(res, { responseCode: '02', data: member });
});

export const deleteTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const member = await TeamMember.findByPk(String(req.params.id));
  if (!member) return sendError(res, '30', 'Membre introuvable');
  await member.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
