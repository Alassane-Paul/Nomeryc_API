import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { UserRole } from '../enums/user.enum';

export interface UserAttributes {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'suspended';
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'status' | 'twoFactorEnabled'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare public id: string;
  declare public email: string;
  declare public password?: string;
  declare public role: UserRole;
  declare public firstName: string;
  declare public lastName: string;
  declare public phone?: string;
  declare public company?: string;
  declare public avatar?: string;
  declare public status?: 'active' | 'inactive' | 'suspended';
  declare public twoFactorEnabled?: boolean;
  declare public twoFactorSecret?: string;
  declare public resetPasswordToken?: string | null;
  declare public resetPasswordExpires?: Date | null;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initUserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.CLIENT,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
      },
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      twoFactorSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
}
