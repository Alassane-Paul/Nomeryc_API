import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { updateTask as updateTaskService, taskUpdateSchema } from './update.service';

export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = taskUpdateSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  const task = await updateTaskService(String(req.params.id), parsed.data);
  if (!task) return sendError(res, '30', 'Tâche non trouvée');
  return sendResponse(res, { responseCode: '02', data: task });
});
