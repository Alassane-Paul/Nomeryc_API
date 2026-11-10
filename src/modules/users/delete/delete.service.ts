import { User } from '../../../models/user.model';

export async function deleteUser(id: string) {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
}
