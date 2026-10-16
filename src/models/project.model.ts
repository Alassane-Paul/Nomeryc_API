import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { ServiceType } from '../enums/service.enum';
import { ProjectStatus } from '../enums/projet.enum';

export interface DeliverableItem {
  id: string;
  title: string;
  status: 'pending' | 'done';
  url?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface ProjectAttributes {
  id: string;
  clientId: string;
  title: string;
  description: string;
  service: ServiceType;
  status: ProjectStatus;
  budget?: number;
  progress?: number;
  startDate?: Date;
  deadline?: Date;
  deliverables?: DeliverableItem[];
  assignedTeam?: TeamMember[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ProjectCreationAttributes
  extends Optional<ProjectAttributes, 'id' | 'budget' | 'progress' | 'startDate' | 'deadline' | 'deliverables' | 'assignedTeam'> {}

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  declare public id: string;
  declare public clientId: string;
  declare public title: string;
  declare public description: string;
  declare public service: ServiceType;
  declare public status: ProjectStatus;
  declare public budget?: number;
  declare public progress?: number;
  declare public startDate?: Date;
  declare public deadline?: Date;
  declare public deliverables?: DeliverableItem[];
  declare public assignedTeam?: TeamMember[];
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
  declare public readonly deletedAt?: Date;
}

export function initProjectModel(sequelize: Sequelize): typeof Project {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      service: {
        type: DataTypes.ENUM(...Object.values(ServiceType)),
        allowNull: false,
        defaultValue: ServiceType.WEB,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ProjectStatus)),
        allowNull: false,
        defaultValue: ProjectStatus.DEVIS,
      },
      budget: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deliverables: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      assignedTeam: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'projects',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['client_id'] },
        { fields: ['status'] },
        { fields: ['service'] },
      ],
    }
  );

  return Project;
}
