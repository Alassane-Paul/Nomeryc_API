import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse } from '../../../utils/response';
import { createTeamMember as createTeamMemberService } from './create.service';

export const createTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const member = await createTeamMemberService(req.body);
  return sendResponse(res, { responseCode: '01', data: member });
});
