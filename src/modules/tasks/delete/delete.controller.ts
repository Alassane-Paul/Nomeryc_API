import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { deleteTask as deleteTaskService } from './delete.service';

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const deleted = await deleteTaskService(String(req.params.id));
  if (!deleted) return sendError(res, '30', 'Tâche non trouvée');
  return sendResponse(res, { responseCode: '03', data: null });
});
