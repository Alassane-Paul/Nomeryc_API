import { Response, Request } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { listTeamMembers } from './list.service';

export const getTeamMembers = asyncHandler(async (_req: Request, res: Response) => {
  const members = await listTeamMembers();
  return sendResponse(res, { data: members });
});
