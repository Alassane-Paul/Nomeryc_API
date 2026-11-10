import { Request, Response } from 'express';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendError, sendResponse } from '../../../utils/response';
import { forgotPasswordSchema, forgotPasswordService } from './forgot-password.service';

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, '10', 'Données invalides', parsed.error.flatten());
  }

  await forgotPasswordService(parsed.data.email);

  return sendResponse(res, {
    responseCode: '00',
    responseMessage: 'Si un compte existe avec cet email, un lien de réinitialisation vient de lui être envoyé.',
    data: null,
  });
});
