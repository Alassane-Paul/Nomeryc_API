import { Response, Request } from 'express';
import { sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { listAllTeamMembers } from './list-all.service';

export const getAllTeamMembers = asyncHandler(async (_req: Request, res: Response) => {
  const members = await listAllTeamMembers();
  return sendResponse(res, { data: members });
});
