"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteItem = exports.Quote = void 0;
exports.initQuoteModel = initQuoteModel;
exports.initQuoteItemModel = initQuoteItemModel;
const sequelize_1 = require("sequelize");
const quote_enum_1 = require("../enums/quote.enum");
const service_enum_1 = require("../enums/service.enum");
class Quote extends sequelize_1.Model {
    id;
    projectId;
    clientId;
    quoteNumber;
    title;
    totalHT;
    tvaRate;
    totalTVA;
    totalTTC;
    discountType;
    discountValue;
    status;
    validUntil;
    terms;
    notes;
    createdAt;
    updatedAt;
}
exports.Quote = Quote;
function initQuoteModel(sequelize) {
    Quote.init({
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
        clientId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        quoteNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        totalHT: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        tvaRate: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 18,
        },
        totalTVA: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        totalTTC: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        discountType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(quote_enum_1.DiscountType)),
            allowNull: true,
        },
        discountValue: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(quote_enum_1.QuoteStatus)),
            allowNull: false,
            defaultValue: quote_enum_1.QuoteStatus.BROUILLON,
        },
        validUntil: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        terms: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'quotes',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['client_id'] },
            { fields: ['project_id'] },
            { fields: ['status'] },
            { unique: true, fields: ['quote_number'] },
        ],
    });
    return Quote;
}
class QuoteItem extends sequelize_1.Model {
    id;
    quoteId;
    sectionId;
    serviceId;
    designation;
    description;
    quantity;
    unitPrice;
    unit;
    discountType;
    discountValue;
    total;
    serviceType;
    createdAt;
    updatedAt;
}
exports.QuoteItem = QuoteItem;
function initQuoteItemModel(sequelize) {
    QuoteItem.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        quoteId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'quotes', key: 'id' },
            onDelete: 'CASCADE',
        },
        sectionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        serviceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        designation: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        quantity: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1,
        },
        unitPrice: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        unit: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: 'unité',
        },
        discountType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(quote_enum_1.DiscountType)),
            allowNull: true,
        },
        discountValue: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        total: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        serviceType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(service_enum_1.ServiceType)),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'quote_items',
        timestamps: true,
        underscored: true,
    });
    return QuoteItem;
}
