"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRequest = void 0;
exports.initContactRequestModel = initContactRequestModel;
const sequelize_1 = require("sequelize");
const service_enum_1 = require("../enums/service.enum");
class ContactRequest extends sequelize_1.Model {
    id;
    name;
    email;
    phone;
    company;
    service;
    budgetMin;
    budgetMax;
    message;
    status;
    assignedTo;
    notes;
    createdAt;
    updatedAt;
}
exports.ContactRequest = ContactRequest;
function initContactRequestModel(sequelize) {
    ContactRequest.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        company: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        service: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(service_enum_1.ServiceType)),
            allowNull: true,
        },
        budgetMin: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        budgetMax: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('nouveau', 'contacte', 'converti', 'rejete'),
            allowNull: false,
            defaultValue: 'nouveau',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'contact_requests',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['status'] },
            { fields: ['email'] },
        ],
    });
    return ContactRequest;
}
