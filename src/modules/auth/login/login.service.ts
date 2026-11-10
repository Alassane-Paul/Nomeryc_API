import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../../../models/user.model';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt.utils';
import { AuthResult } from '../auth.types';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export async function loginService(data: LoginDto): Promise<AuthResult> {
  try {
    const user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      return { success: false, errorCode: '21', errorMessage: 'Email ou mot de passe incorrect' };
    }

    if (user.status === 'inactive' || user.status === 'suspended') {
      return { success: false, errorCode: '50', errorMessage: 'Ce compte est désactivé. Contactez le support.' };
    }

    if (!user.password) {
      return { success: false, errorCode: '21', errorMessage: 'Email ou mot de passe incorrect' };
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      return { success: false, errorCode: '21', errorMessage: 'Email ou mot de passe incorrect' };
    }

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        company: user.company,
        status: user.status,
      },
      token: accessToken,
      refreshToken,
    };
  } catch (error: any) {
    console.error('Erreur login:', error);
    return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la connexion' };
  }
}
