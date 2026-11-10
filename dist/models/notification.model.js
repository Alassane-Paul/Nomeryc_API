"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
exports.initNotificationModel = initNotificationModel;
const sequelize_1 = require("sequelize");
class Notification extends sequelize_1.Model {
    id;
    userId;
    title;
    message;
    type;
    isRead;
    link;
    createdAt;
    updatedAt;
}
exports.Notification = Notification;
function initNotificationModel(sequelize) {
    Notification.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('PROJECT', 'INVOICE', 'MESSAGE', 'QUOTE', 'SYSTEM'),
            allowNull: false,
            defaultValue: 'SYSTEM',
        },
        isRead: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        link: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'notifications',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['is_read'] },
            { fields: ['type'] },
        ],
    });
    return Notification;
}
