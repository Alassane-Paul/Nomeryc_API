import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

export async function getUser(id: string, requesterId: string | undefined, role: UserRole | undefined) {
  if (role !== UserRole.ADMIN && id !== requesterId) {
    return { error: 'forbidden' as const };
  }
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
  });
  if (!user) return { error: 'not-found' as const };
  return { user };
}
