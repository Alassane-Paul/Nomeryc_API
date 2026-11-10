"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItem = exports.Invoice = void 0;
exports.initInvoiceModel = initInvoiceModel;
exports.initInvoiceItemModel = initInvoiceItemModel;
const sequelize_1 = require("sequelize");
const invoice_enum_1 = require("../enums/invoice.enum");
const service_enum_1 = require("../enums/service.enum");
class Invoice extends sequelize_1.Model {
    id;
    quoteId;
    projectId;
    clientId;
    invoiceNumber;
    title;
    totalHT;
    tvaRate;
    totalTVA;
    totalTTC;
    amountPaid;
    status;
    dueDate;
    paidAt;
    paymentMethod;
    stripePaymentIntentId;
    fedapayTransactionId;
    notes;
    createdAt;
    updatedAt;
}
exports.Invoice = Invoice;
function initInvoiceModel(sequelize) {
    Invoice.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        quoteId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: 'quotes', key: 'id' },
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
        invoiceNumber: {
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
        amountPaid: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(invoice_enum_1.InvoiceStatus)),
            allowNull: false,
            defaultValue: invoice_enum_1.InvoiceStatus.BROUILLON,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        paidAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(invoice_enum_1.PaymentMethod)),
            allowNull: true,
        },
        stripePaymentIntentId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        fedapayTransactionId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'invoices',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['client_id'] },
            { fields: ['status'] },
            { unique: true, fields: ['invoice_number'] },
        ],
    });
    return Invoice;
}
class InvoiceItem extends sequelize_1.Model {
    id;
    invoiceId;
    serviceId;
    designation;
    description;
    quantity;
    unitPrice;
    total;
    serviceType;
    createdAt;
    updatedAt;
}
exports.InvoiceItem = InvoiceItem;
function initInvoiceItemModel(sequelize) {
    InvoiceItem.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        invoiceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'invoices', key: 'id' },
            onDelete: 'CASCADE',
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
        tableName: 'invoice_items',
        timestamps: true,
        underscored: true,
    });
    return InvoiceItem;
}
