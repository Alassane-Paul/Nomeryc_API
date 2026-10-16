import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface NewsletterSubscriberAttributes {
  id: string;
  email: string;
  unsubscribeToken: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsletterSubscriberCreationAttributes
  extends Optional<NewsletterSubscriberAttributes, 'id' | 'isActive'> {}

export class NewsletterSubscriber
  extends Model<NewsletterSubscriberAttributes, NewsletterSubscriberCreationAttributes>
  implements NewsletterSubscriberAttributes
{
  public id!: string;
  public email!: string;
  public unsubscribeToken!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initNewsletterSubscriberModel(sequelize: Sequelize): typeof NewsletterSubscriber {
  NewsletterSubscriber.init(
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
        validate: { isEmail: true },
      },
      unsubscribeToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'newsletter_subscribers',
      timestamps: true,
      underscored: true,
      indexes: [{ unique: true, fields: ['email'] }],
    }
  );

  return NewsletterSubscriber;
}
