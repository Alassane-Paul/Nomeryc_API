import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { updateContactStatusService } from './update.service';

export const updateContactStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const contact = await updateContactStatusService(String(req.params.id), req.body);
  if (!contact) return sendError(res, '30', 'Demande non trouvée');
  return sendResponse(res, { responseCode: '02', data: contact });
});
