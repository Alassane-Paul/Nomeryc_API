"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
exports.initProjectModel = initProjectModel;
const sequelize_1 = require("sequelize");
const service_enum_1 = require("../enums/service.enum");
const projet_enum_1 = require("../enums/projet.enum");
class Project extends sequelize_1.Model {
}
exports.Project = Project;
function initProjectModel(sequelize) {
    Project.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        clientId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        service: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(service_enum_1.ServiceType)),
            allowNull: false,
            defaultValue: service_enum_1.ServiceType.WEB,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(projet_enum_1.ProjectStatus)),
            allowNull: false,
            defaultValue: projet_enum_1.ProjectStatus.DEVIS,
        },
        budget: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        progress: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        deadline: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        deliverables: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        assignedTeam: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
    }, {
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
    });
    return Project;
}
