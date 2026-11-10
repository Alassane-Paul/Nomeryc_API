import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { unsubscribeService } from './unsubscribe.service';

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const result = await unsubscribeService(req.body, req.query);
  if (result === 'missing-token') return sendError(res, '11', 'Token requis');
  if (result === 'not-found') return sendError(res, '30', 'Abonnement introuvable');
  return sendResponse(res, { responseCode: '00', responseMessage: 'Désabonnement effectué.', data: null });
});
