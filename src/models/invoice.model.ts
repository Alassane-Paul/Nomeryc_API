import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { InvoiceStatus, PaymentMethod } from '../enums/invoice.enum';
import { ServiceType } from '../enums/service.enum';

// ===== INVOICE =====
export interface InvoiceAttributes {
  id: string;
  quoteId?: string;
  projectId?: string;
  clientId: string;
  invoiceNumber: string;
  title?: string;
  totalHT: number;
  tvaRate: number;
  totalTVA: number;
  totalTTC: number;
  amountPaid?: number;
  status: InvoiceStatus;
  dueDate?: Date;
  paidAt?: Date;
  paymentMethod?: PaymentMethod;
  stripePaymentIntentId?: string;
  fedapayTransactionId?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface InvoiceCreationAttributes
  extends Optional<InvoiceAttributes, 'id' | 'quoteId' | 'projectId' | 'title' | 'amountPaid' | 'dueDate' | 'paidAt' | 'paymentMethod' | 'stripePaymentIntentId' | 'fedapayTransactionId' | 'notes'> {}

export class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes
{
  public id!: string;
  public quoteId?: string;
  public projectId?: string;
  public clientId!: string;
  public invoiceNumber!: string;
  public title?: string;
  public totalHT!: number;
  public tvaRate!: number;
  public totalTVA!: number;
  public totalTTC!: number;
  public amountPaid?: number;
  public status!: InvoiceStatus;
  public dueDate?: Date;
  public paidAt?: Date;
  public paymentMethod?: PaymentMethod;
  public stripePaymentIntentId?: string;
  public fedapayTransactionId?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initInvoiceModel(sequelize: Sequelize): typeof Invoice {
  Invoice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quoteId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'quotes', key: 'id' },
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
      invoiceNumber: {
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
      amountPaid: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(InvoiceStatus)),
        allowNull: false,
        defaultValue: InvoiceStatus.BROUILLON,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.ENUM(...Object.values(PaymentMethod)),
        allowNull: true,
      },
      stripePaymentIntentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fedapayTransactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'invoices',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['client_id'] },
        { fields: ['status'] },
        { unique: true, fields: ['invoice_number'] },
      ],
    }
  );

  return Invoice;
}

// ===== INVOICE ITEM =====
export interface InvoiceItemAttributes {
  id: string;
  invoiceId: string;
  serviceId?: string;
  designation: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  serviceType?: ServiceType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceItemCreationAttributes
  extends Optional<InvoiceItemAttributes, 'id' | 'serviceId' | 'description' | 'serviceType'> {}

export class InvoiceItem
  extends Model<InvoiceItemAttributes, InvoiceItemCreationAttributes>
  implements InvoiceItemAttributes
{
  public id!: string;
  public invoiceId!: string;
  public serviceId?: string;
  public designation!: string;
  public description?: string;
  public quantity!: number;
  public unitPrice!: number;
  public total!: number;
  public serviceType?: ServiceType;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initInvoiceItemModel(sequelize: Sequelize): typeof InvoiceItem {
  InvoiceItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'invoices', key: 'id' },
        onDelete: 'CASCADE',
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
      tableName: 'invoice_items',
      timestamps: true,
      underscored: true,
    }
  );

  return InvoiceItem;
}
