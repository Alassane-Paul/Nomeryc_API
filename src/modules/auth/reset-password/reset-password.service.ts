import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { z } from 'zod';
import { User } from '../../../models/user.model';
import { AuthResult } from '../auth.types';

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export async function resetPasswordService(token: string, newPassword: string): Promise<AuthResult> {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { [Op.gte]: new Date() },
      },
    });

    if (!user) {
      return { success: false, errorCode: '22', errorMessage: 'Lien invalide ou expiré' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    } as any);

    return { success: true };
  } catch (error: any) {
    console.error('Erreur resetPassword:', error);
    return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la réinitialisation' };
  }
}
