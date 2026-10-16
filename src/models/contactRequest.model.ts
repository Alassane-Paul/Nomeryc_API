import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { ServiceType } from '../enums/service.enum';

export type ContactStatus = 'nouveau' | 'contacte' | 'converti' | 'rejete';

export interface ContactRequestAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: ServiceType;
  budgetMin?: number;
  budgetMax?: number;
  message: string;
  status: ContactStatus;
  assignedTo?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactRequestCreationAttributes
  extends Optional<ContactRequestAttributes, 'id' | 'phone' | 'company' | 'service' | 'budgetMin' | 'budgetMax' | 'status' | 'assignedTo' | 'notes'> {}

export class ContactRequest
  extends Model<ContactRequestAttributes, ContactRequestCreationAttributes>
  implements ContactRequestAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public phone?: string;
  public company?: string;
  public service?: ServiceType;
  public budgetMin?: number;
  public budgetMax?: number;
  public message!: string;
  public status!: ContactStatus;
  public assignedTo?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initContactRequestModel(sequelize: Sequelize): typeof ContactRequest {
  ContactRequest.init(
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
      email: {
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
      service: {
        type: DataTypes.ENUM(...Object.values(ServiceType)),
        allowNull: true,
      },
      budgetMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      budgetMax: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('nouveau', 'contacte', 'converti', 'rejete'),
        allowNull: false,
        defaultValue: 'nouveau',
      },
      assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'contact_requests',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['email'] },
      ],
    }
  );

  return ContactRequest;
}
