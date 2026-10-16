import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TeamMemberAttributes {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface TeamMemberCreationAttributes
  extends Optional<TeamMemberAttributes, 'id' | 'bio' | 'avatar' | 'isPublic' | 'orderIndex'> {}

export class TeamMember
  extends Model<TeamMemberAttributes, TeamMemberCreationAttributes>
  implements TeamMemberAttributes
{
  public id!: string;
  public name!: string;
  public role!: string;
  public bio?: string;
  public avatar?: string;
  public isPublic?: boolean;
  public orderIndex?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initTeamMemberModel(sequelize: Sequelize): typeof TeamMember {
  TeamMember.init(
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
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      avatar: {
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
      tableName: 'team_members',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    }
  );

  return TeamMember;
}
