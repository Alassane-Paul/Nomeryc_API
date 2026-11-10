import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { resetPasswordSchema, resetPasswordService } from './reset-password.service';

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  }

  const result = await resetPasswordService(parsed.data.token, parsed.data.password);
  if (!result.success) {
    return sendError(res, result.errorCode || '99', result.errorMessage);
  }

  return sendResponse(res, {
    responseCode: '00',
    responseMessage: 'Mot de passe réinitialisé avec succès.',
    data: null,
  });
});
