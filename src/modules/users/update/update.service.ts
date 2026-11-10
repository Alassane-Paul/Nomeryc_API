import { User } from '../../../models/user.model';
import { UserRole } from '../../../enums/user.enum';

export async function updateUser(id: string, requesterId: string | undefined, role: UserRole | undefined, data: any) {
  const isAdmin = role === UserRole.ADMIN;
  if (!isAdmin && id !== requesterId) return { error: 'forbidden' as const };
  const user = await User.findByPk(id);
  if (!user) return { error: 'not-found' as const };

  const payload = { ...data };
  if (!isAdmin) {
    delete payload.role;
    delete payload.status;
  }
  await user.update(payload);
  const updated = await User.findByPk(id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
  });
  return { updated };
}
