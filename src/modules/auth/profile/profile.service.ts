import { User } from '../../../models/user.model';
import { AuthResult } from '../auth.types';

export async function getCurrentUserService(userId: string): Promise<AuthResult> {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
    });

    if (!user) {
      return { success: false, errorCode: '31', errorMessage: 'Utilisateur non trouvé' };
    }

    return { success: true, user: user.toJSON() };
  } catch (error: any) {
    console.error('Erreur getCurrentUser:', error);
    return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la récupération du profil' };
  }
}
