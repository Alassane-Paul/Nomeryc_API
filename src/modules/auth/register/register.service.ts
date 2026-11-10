import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt.utils';
import { sendMail, mailTemplates } from '../../../services/mail.service';
import { AuthResult } from '../auth.types';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CLIENT),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export async function registerService(data: RegisterDto): Promise<AuthResult> {
  try {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      return { success: false, errorCode: '41', errorMessage: 'Cet email est déjà utilisé' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      company: data.company,
      role: data.role || UserRole.CLIENT,
    });

    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    const welcome = mailTemplates.welcome(user.firstName);
    sendMail({ to: user.email, ...welcome });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        company: user.company,
        status: user.status,
      },
      token: accessToken,
      refreshToken,
    };
  } catch (error: any) {
    console.error('Erreur register:', error);
    return { success: false, errorCode: '99', errorMessage: 'Erreur lors de l\'inscription' };
  }
}
