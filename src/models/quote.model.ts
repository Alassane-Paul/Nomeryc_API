import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { QuoteStatus, DiscountType } from '../enums/quote.enum';
import { ServiceType } from '../enums/service.enum';

// ===== QUOTE =====
export interface QuoteAttributes {
  id: string;
  projectId?: string;
  clientId: string;
  quoteNumber: string;
  title?: string;
  totalHT: number;
  tvaRate: number;
  totalTVA: number;
  totalTTC: number;
  discountType?: DiscountType;
  discountValue?: number;
  status: QuoteStatus;
  validUntil?: Date;
  terms?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface QuoteCreationAttributes
  extends Optional<QuoteAttributes, 'id' | 'projectId' | 'title' | 'discountType' | 'discountValue' | 'terms' | 'notes' | 'validUntil'> {}

export class Quote
  extends Model<QuoteAttributes, QuoteCreationAttributes>
  implements QuoteAttributes
{
  public id!: string;
  public projectId?: string;
  public clientId!: string;
  public quoteNumber!: string;
  public title?: string;
  public totalHT!: number;
  public tvaRate!: number;
  public totalTVA!: number;
  public totalTTC!: number;
  public discountType?: DiscountType;
  public discountValue?: number;
  public status!: QuoteStatus;
  public validUntil?: Date;
  public terms?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initQuoteModel(sequelize: Sequelize): typeof Quote {
  Quote.init(
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
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      quoteNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalHT: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      tvaRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 18,
      },
      totalTVA: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalTTC: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      discountType: {
        type: DataTypes.ENUM(...Object.values(DiscountType)),
        allowNull: true,
      },
      discountValue: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(QuoteStatus)),
        allowNull: false,
        defaultValue: QuoteStatus.BROUILLON,
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'quotes',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['client_id'] },
        { fields: ['project_id'] },
        { fields: ['status'] },
        { unique: true, fields: ['quote_number'] },
      ],
    }
  );

  return Quote;
}

// ===== QUOTE ITEM =====
export interface QuoteItemAttributes {
  id: string;
  quoteId: string;
  sectionId?: string;
  serviceId?: string;
  designation: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  discountType?: DiscountType;
  discountValue?: number;
  total: number;
  serviceType?: ServiceType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuoteItemCreationAttributes
  extends Optional<QuoteItemAttributes, 'id' | 'sectionId' | 'serviceId' | 'description' | 'unit' | 'discountType' | 'discountValue' | 'serviceType'> {}

export class QuoteItem
  extends Model<QuoteItemAttributes, QuoteItemCreationAttributes>
  implements QuoteItemAttributes
{
  public id!: string;
  public quoteId!: string;
  public sectionId?: string;
  public serviceId?: string;
  public designation!: string;
  public description?: string;
  public quantity!: number;
  public unitPrice!: number;
  public unit?: string;
  public discountType?: DiscountType;
  public discountValue?: number;
  public total!: number;
  public serviceType?: ServiceType;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initQuoteItemModel(sequelize: Sequelize): typeof QuoteItem {
  QuoteItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quoteId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'quotes', key: 'id' },
        onDelete: 'CASCADE',
      },
      sectionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      serviceId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'unité',
      },
      discountType: {
        type: DataTypes.ENUM(...Object.values(DiscountType)),
        allowNull: true,
      },
      discountValue: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      serviceType: {
        type: DataTypes.ENUM(...Object.values(ServiceType)),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'quote_items',
      timestamps: true,
      underscored: true,
    }
  );

  return QuoteItem;
}
