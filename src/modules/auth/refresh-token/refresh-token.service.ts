import { User } from '../../../models/user.model';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../../utils/jwt.utils';
import { AuthResult } from '../auth.types';

export async function refreshTokenService(refreshToken: string): Promise<AuthResult> {
  try {
    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh_token') {
      return { success: false, errorCode: '22', errorMessage: 'Token de rafraîchissement invalide ou expiré' };
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password', 'resetPasswordToken'] },
    });
    if (!user) {
      return { success: false, errorCode: '31', errorMessage: 'Utilisateur non trouvé' };
    }

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    return {
      success: true,
      user: user.toJSON(),
      token: accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error: any) {
    console.error('Erreur refreshToken:', error);
    return { success: false, errorCode: '99', errorMessage: 'Erreur lors du rafraîchissement du token' };
  }
}
