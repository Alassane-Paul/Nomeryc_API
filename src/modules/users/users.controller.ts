import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../models/user.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';

export const getUsers = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
    order: [['createdAt', 'DESC']],
  });
  return sendResponse(res, { data: users });
});

export const getUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  if (!isAdmin && id !== req.user?.id) {
    return sendError(res, '23', 'Accès refusé');
  }

  const user = await User.findByPk(id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
  });
  if (!user) return sendError(res, '31', 'Utilisateur non trouvé');
  return sendResponse(res, { data: user });
});

export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;
  const id = String(req.params.id);
  if (!isAdmin && id !== req.user?.id) {
    return sendError(res, '23', 'Accès refusé');
  }

  const user = await User.findByPk(id);
  if (!user) return sendError(res, '31', 'Utilisateur non trouvé');

  if (!isAdmin) {
    delete req.body.role;
    delete req.body.status;
  }

  await user.update(req.body);
  const updated = await User.findByPk(id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
  });
  return sendResponse(res, { responseCode: '02', data: updated });
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = String(req.params.id);
  if (id !== req.user?.id) {
    return sendError(res, '23', 'Accès refusé');
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return sendError(res, '11', 'Mot de passe actuel et nouveau requis');
  }

  const user = await User.findByPk(id);
  if (!user || !user.password) return sendError(res, '31', 'Utilisateur non trouvé');

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return sendError(res, '21', 'Mot de passe actuel incorrect');

  const hashed = await bcrypt.hash(newPassword, 12);
  await user.update({ password: hashed });
  return sendResponse(res, { responseMessage: 'Mot de passe modifié avec succès', data: null });
});

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findByPk(String(req.params.id));
  if (!user) return sendError(res, '31', 'Utilisateur non trouvé');
  await user.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});
