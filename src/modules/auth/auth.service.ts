import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { z } from 'zod';
import { User } from '../../models/user.model';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt.utils';
import { UserRole } from '../../enums/user.enum';
import { sendMail, mailTemplates } from '../../services/mail.service';
import { env } from '../../config/env';

// ===== VALIDATION SCHEMAS =====
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CLIENT),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;

export interface AuthResult {
  success: boolean;
  user?: object;
  token?: string;
  refreshToken?: string;
  errorCode?: string;
  errorMessage?: string;
}

// ===== SERVICES =====

/**
 * Authentifie un utilisateur et retourne les tokens JWT
 */
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

/**
 * Inscrit un nouvel utilisateur
 */
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
    sendMail({ to: user.email, ...welcome }); // fire-and-forget : ne bloque pas l'inscription

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

/**
 * Récupère le profil de l'utilisateur connecté
 */
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

/**
 * Rafraîchit les tokens JWT
 */
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

/**
 * Génère un token de réinitialisation et envoie l'email correspondant.
 * Réponse volontairement identique que l'email existe ou non (anti-énumération de comptes).
 */
export async function forgotPasswordService(email: string): Promise<AuthResult> {
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      await user.update({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1h
      } as any);

      const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
      const mail = mailTemplates.passwordReset(user.firstName, resetUrl);
      await sendMail({ to: user.email, ...mail });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erreur forgotPassword:', error);
    return { success: false, errorCode: '99', errorMessage: 'Erreur lors de la demande de réinitialisation' };
  }
}

/** Vérifie le token (haché) et son expiration, puis change le mot de passe. */
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
