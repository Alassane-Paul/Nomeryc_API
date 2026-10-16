import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { DocumentCategory } from '../enums/document.enum';

export interface DocumentAttributes {
  id: string;
  name: string;
  url: string;
  mimeType?: string;
  size?: string;
  category: DocumentCategory;
  clientId: string;
  projectId?: string;
  uploadedById?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentCreationAttributes
  extends Optional<DocumentAttributes, 'id' | 'mimeType' | 'size' | 'category' | 'projectId' | 'uploadedById'> {}

export class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  declare public id: string;
  declare public name: string;
  declare public url: string;
  declare public mimeType?: string;
  declare public size?: string;
  declare public category: DocumentCategory;
  declare public clientId: string;
  declare public projectId?: string;
  declare public uploadedById?: string;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initDocumentModel(sequelize: Sequelize): typeof Document {
  Document.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      url: { type: DataTypes.STRING(500), allowNull: false },
      mimeType: { type: DataTypes.STRING, allowNull: true },
      size: { type: DataTypes.STRING, allowNull: true },
      category: {
        type: DataTypes.ENUM(...Object.values(DocumentCategory)),
        allowNull: false,
        defaultValue: DocumentCategory.AUTRE,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'SET NULL',
      },
      uploadedById: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
    },
    {
      sequelize,
      tableName: 'documents',
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ['client_id'] }, { fields: ['project_id'] }, { fields: ['category'] }],
    }
  );

  return Document;
}
