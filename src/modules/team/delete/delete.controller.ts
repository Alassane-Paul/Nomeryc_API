import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deleteTeamMember as deleteTeamMemberService } from './delete.service';

export const deleteTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteTeamMemberService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Membre introuvable');
  return sendResponse(res, { responseCode: '03', data: null });
});
