import crypto from 'crypto';
import { z } from 'zod';
import { User } from '../../../models/user.model';
import { sendMail, mailTemplates } from '../../../services/mail.service';
import { env } from '../../../config/env';
import { AuthResult } from '../auth.types';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export async function forgotPasswordService(email: string): Promise<AuthResult> {
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      await user.update({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
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
