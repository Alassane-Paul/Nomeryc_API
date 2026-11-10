import { Request, Response } from 'express';
import { sendError, sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { addCommentService } from './add-comment.service';

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const result = await addCommentService(req.params.slug as string, req.body);
  if ('error' in result && result.error === 'not-found') return sendError(res, '30', 'Article non trouvé');
  if ('error' in result && result.error === 'invalid') return sendError(res, '11', 'Nom et commentaire requis');
  return sendResponse(res, {
    responseCode: '01',
    responseMessage: 'Commentaire soumis pour modération',
    data: result.comment,
  });
});
