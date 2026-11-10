import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updateTeamMember as updateTeamMemberService } from './update.service';

export const updateTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const member = await updateTeamMemberService(String(req.params.id), req.body);
  if (!member) return sendError(res, '30', 'Membre introuvable');
  return sendResponse(res, { responseCode: '02', data: member });
});
