import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface FaqAttributes {
  id: string;
  question: string;
  answer: string;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface FaqCreationAttributes extends Optional<FaqAttributes, 'id' | 'isPublic' | 'orderIndex'> {}

export class Faq extends Model<FaqAttributes, FaqCreationAttributes> implements FaqAttributes {
  public id!: string;
  public question!: string;
  public answer!: string;
  public isPublic?: boolean;
  public orderIndex?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initFaqModel(sequelize: Sequelize): typeof Faq {
  Faq.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'faqs',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    }
  );

  return Faq;
}
