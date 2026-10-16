import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PortfolioItemAttributes {
  id: string;
  title: string;
  description: string;
  category: string;
  images?: string[];
  coverImage?: string;
  technologies?: string[];
  clientName?: string;
  liveUrl?: string;
  featured?: boolean;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface PortfolioItemCreationAttributes
  extends Optional<PortfolioItemAttributes, 'id' | 'images' | 'coverImage' | 'technologies' | 'clientName' | 'liveUrl' | 'featured' | 'isPublic' | 'orderIndex'> {}

export class PortfolioItem
  extends Model<PortfolioItemAttributes, PortfolioItemCreationAttributes>
  implements PortfolioItemAttributes
{
  public id!: string;
  public title!: string;
  public description!: string;
  public category!: string;
  public images?: string[];
  public coverImage?: string;
  public technologies?: string[];
  public clientName?: string;
  public liveUrl?: string;
  public featured?: boolean;
  public isPublic?: boolean;
  public orderIndex?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPortfolioItemModel(sequelize: Sequelize): typeof PortfolioItem {
  PortfolioItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        // Chaîne libre (et non un enum) : ce sont les catégories affichées dans le
        // filtre du portfolio public (ex. 'web', 'mobile', 'design', 'marketing'),
        // distinctes des ServiceType utilisés pour les devis/projets. Laisser en
        // texte libre permet à l'admin d'ajouter une catégorie depuis le back-office
        // sans qu'un développeur ait à modifier un enum côté code.
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'web',
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      technologies: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      liveUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: 'portfolio_items',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['category'] },
        { fields: ['is_public'] },
        { fields: ['featured'] },
      ],
    }
  );

  return PortfolioItem;
}
