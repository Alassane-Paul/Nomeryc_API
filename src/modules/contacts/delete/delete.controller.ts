import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { deleteContactRequestService } from './delete.service';

export const deleteContactRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteContactRequestService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Demande non trouvée');
  return sendResponse(res, { responseCode: '03', data: null });
});
