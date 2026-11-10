import { Response, Request } from 'express';
import { sendResponse, sendError } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { getTeamMember as getTeamMemberService } from './get.service';

export const getTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await getTeamMemberService(String(req.params.id));
  if (!member) return sendError(res, '30', 'Membre introuvable');
  return sendResponse(res, { data: member });
});
