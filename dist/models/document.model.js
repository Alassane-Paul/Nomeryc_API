"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
exports.initDocumentModel = initDocumentModel;
const sequelize_1 = require("sequelize");
const document_enum_1 = require("../enums/document.enum");
class Document extends sequelize_1.Model {
}
exports.Document = Document;
function initDocumentModel(sequelize) {
    Document.init({
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        url: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
        mimeType: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        size: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(document_enum_1.DocumentCategory)),
            allowNull: false,
            defaultValue: document_enum_1.DocumentCategory.AUTRE,
        },
        clientId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        projectId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'projects', key: 'id' },
            onDelete: 'SET NULL',
        },
        uploadedById: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'SET NULL',
        },
    }, {
        sequelize,
        tableName: 'documents',
        timestamps: true,
        underscored: true,
        indexes: [{ fields: ['client_id'] }, { fields: ['project_id'] }, { fields: ['category'] }],
    });
    return Document;
}
