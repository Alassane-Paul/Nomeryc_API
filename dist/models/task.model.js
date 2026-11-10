"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
exports.initTaskModel = initTaskModel;
const sequelize_1 = require("sequelize");
const task_enum_1 = require("../enums/task.enum");
class Task extends sequelize_1.Model {
}
exports.Task = Task;
function initTaskModel(sequelize) {
    Task.init({
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        projectId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'projects', key: 'id' },
            onDelete: 'CASCADE',
        },
        assigneeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'SET NULL',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(task_enum_1.TaskStatus)),
            allowNull: false,
            defaultValue: task_enum_1.TaskStatus.TODO,
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(task_enum_1.TaskPriority)),
            allowNull: false,
            defaultValue: task_enum_1.TaskPriority.MOYENNE,
        },
        dueDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        position: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
        completedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    }, {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
        underscored: true,
        indexes: [{ fields: ['project_id'] }, { fields: ['assignee_id'] }, { fields: ['status'] }],
    });
    return Task;
}
