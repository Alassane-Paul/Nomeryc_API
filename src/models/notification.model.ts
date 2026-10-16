import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type NotificationType = 'PROJECT' | 'INVOICE' | 'MESSAGE' | 'QUOTE' | 'SYSTEM';

export interface NotificationAttributes {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'id' | 'isRead' | 'link'> {}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public userId!: string;
  public title!: string;
  public message!: string;
  public type!: NotificationType;
  public isRead!: boolean;
  public link?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initNotificationModel(sequelize: Sequelize): typeof Notification {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('PROJECT', 'INVOICE', 'MESSAGE', 'QUOTE', 'SYSTEM'),
        allowNull: false,
        defaultValue: 'SYSTEM',
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['is_read'] },
        { fields: ['type'] },
      ],
    }
  );

  return Notification;
}
