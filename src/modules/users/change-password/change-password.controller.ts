import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { sendResponse, sendError } from '../../../utils/response';
import { changePassword as changePasswordService } from './change-password.service';

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const result = await changePasswordService(String(req.params.id), req.user?.id, currentPassword, newPassword);
  if ('error' in result && result.error === 'forbidden') return sendError(res, '23', 'Accès refusé');
  if ('error' in result && result.error === 'missing-password') {
    return sendError(res, '11', 'Mot de passe actuel et nouveau requis');
  }
  if ('error' in result && result.error === 'invalid-password') return sendError(res, '21', 'Mot de passe actuel incorrect');
  if ('error' in result) return sendError(res, '31', 'Utilisateur non trouvé');
  return sendResponse(res, { responseMessage: 'Mot de passe modifié avec succès', data: null });
});
