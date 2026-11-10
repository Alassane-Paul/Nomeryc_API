import bcrypt from 'bcryptjs';
import { User } from '../../../models/user.model';

export async function changePassword(id: string, requesterId: string | undefined, currentPassword: any, newPassword: any) {
  if (id !== requesterId) return { error: 'forbidden' as const };
  if (!currentPassword || !newPassword) return { error: 'missing-password' as const };
  const user = await User.findByPk(id);
  if (!user || !user.password) return { error: 'not-found' as const };
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: 'invalid-password' as const };
  const hashed = await bcrypt.hash(newPassword, 12);
  await user.update({ password: hashed });
  return { success: true as const };
}
