import { User } from '../../../models/user.model';

export async function listUsers() {
  return User.findAll({
    attributes: { exclude: ['password', 'resetPasswordToken', 'twoFactorSecret'] },
    order: [['createdAt', 'DESC']],
  });
}
