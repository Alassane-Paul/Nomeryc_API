import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { TaskStatus, TaskPriority } from '../enums/task.enum';

export interface TaskAttributes {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  position?: number;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes
  extends Optional<TaskAttributes, 'id' | 'description' | 'projectId' | 'assigneeId' | 'status' | 'priority' | 'dueDate' | 'position' | 'completedAt'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare public id: string;
  declare public title: string;
  declare public description?: string;
  declare public projectId?: string;
  declare public assigneeId?: string;
  declare public status: TaskStatus;
  declare public priority: TaskPriority;
  declare public dueDate?: Date;
  declare public position?: number;
  declare public completedAt?: Date;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

export function initTaskModel(sequelize: Sequelize): typeof Task {
  Task.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      projectId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      assigneeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(TaskStatus)),
        allowNull: false,
        defaultValue: TaskStatus.TODO,
      },
      priority: {
        type: DataTypes.ENUM(...Object.values(TaskPriority)),
        allowNull: false,
        defaultValue: TaskPriority.MOYENNE,
      },
      dueDate: { type: DataTypes.DATE, allowNull: true },
      position: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      completedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      tableName: 'tasks',
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ['project_id'] }, { fields: ['assignee_id'] }, { fields: ['status'] }],
    }
  );

  return Task;
}
