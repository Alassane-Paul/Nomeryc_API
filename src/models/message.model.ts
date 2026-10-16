import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface AttachmentItem {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface MessageAttributes {
  id: string;
  projectId?: string;
  senderId: string;
  recipientId?: string;
  content: string;
  attachments?: AttachmentItem[];
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes
  extends Optional<MessageAttributes, 'id' | 'projectId' | 'recipientId' | 'attachments' | 'isRead'> {}

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: string;
  public projectId?: string;
  public senderId!: string;
  public recipientId?: string;
  public content!: string;
  public attachments?: AttachmentItem[];
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initMessageModel(sequelize: Sequelize): typeof Message {
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'messages',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['project_id'] },
        { fields: ['sender_id'] },
        { fields: ['recipient_id'] },
        { fields: ['is_read'] },
      ],
    }
  );

  return Message;
}
