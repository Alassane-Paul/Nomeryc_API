import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TestimonialAttributes {
  id: string;
  name: string;
  role: string;
  content: string;
  initials?: string;
  rating?: number;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface TestimonialCreationAttributes
  extends Optional<TestimonialAttributes, 'id' | 'initials' | 'rating' | 'isPublic' | 'orderIndex'> {}

export class Testimonial
  extends Model<TestimonialAttributes, TestimonialCreationAttributes>
  implements TestimonialAttributes
{
  public id!: string;
  public name!: string;
  public role!: string;
  public content!: string;
  public initials?: string;
  public rating?: number;
  public isPublic?: boolean;
  public orderIndex?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initTestimonialModel(sequelize: Sequelize): typeof Testimonial {
  Testimonial.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      initials: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5,
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
      tableName: 'testimonials',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    }
  );

  return Testimonial;
}
