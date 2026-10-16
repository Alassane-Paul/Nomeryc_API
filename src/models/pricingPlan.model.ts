import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PricingPlanAttributes {
  id: string;
  name: string;
  badge?: string;
  price: string;
  currency?: string;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface PricingPlanCreationAttributes
  extends Optional<
    PricingPlanAttributes,
    'id' | 'badge' | 'currency' | 'period' | 'description' | 'features' | 'highlighted' | 'ctaText' | 'ctaLink' | 'isPublic' | 'orderIndex'
  > {}

export class PricingPlan
  extends Model<PricingPlanAttributes, PricingPlanCreationAttributes>
  implements PricingPlanAttributes
{
  public id!: string;
  public name!: string;
  public badge?: string;
  public price!: string;
  public currency?: string;
  public period?: string;
  public description?: string;
  public features?: string[];
  public highlighted?: boolean;
  public ctaText?: string;
  public ctaLink?: string;
  public isPublic?: boolean;
  public orderIndex?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPricingPlanModel(sequelize: Sequelize): typeof PricingPlan {
  PricingPlan.init(
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
      badge: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        // Texte libre : permet "990", "2 490" ou "Sur devis" sans contrainte numérique.
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'FCFA',
      },
      period: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      features: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      highlighted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ctaText: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ctaLink: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: 'pricing_plans',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    }
  );

  return PricingPlan;
}
