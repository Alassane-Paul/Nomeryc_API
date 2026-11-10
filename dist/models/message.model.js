"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
exports.initMessageModel = initMessageModel;
const sequelize_1 = require("sequelize");
class Message extends sequelize_1.Model {
    id;
    projectId;
    senderId;
    recipientId;
    content;
    attachments;
    isRead;
    createdAt;
    updatedAt;
}
exports.Message = Message;
function initMessageModel(sequelize) {
    Message.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        projectId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'projects', key: 'id' },
        },
        senderId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        recipientId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'users', key: 'id' },
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        attachments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        isRead: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'messages',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['project_id'] },
            { fields: ['sender_id'] },
            { fields: ['recipient_id'] },
            { fields: ['is_read'] },
        ],
    });
    return Message;
}
