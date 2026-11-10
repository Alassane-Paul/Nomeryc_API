import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { subscribeService } from './subscribe.service';

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const result = await subscribeService(req.body);
  if ('error' in result) return sendError(res, '10', 'Email invalide');
  if (result.alreadySubscribed) {
    return sendResponse(res, { responseCode: '00', responseMessage: 'Vous êtes déjà inscrit à la newsletter.', data: null });
  }
  return sendResponse(res, { responseCode: '01', responseMessage: 'Inscription réussie !', data: null });
});
