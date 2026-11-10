"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingPlan = void 0;
exports.initPricingPlanModel = initPricingPlanModel;
const sequelize_1 = require("sequelize");
class PricingPlan extends sequelize_1.Model {
    id;
    name;
    badge;
    price;
    currency;
    period;
    description;
    features;
    highlighted;
    ctaText;
    ctaLink;
    isPublic;
    orderIndex;
    createdAt;
    updatedAt;
}
exports.PricingPlan = PricingPlan;
function initPricingPlanModel(sequelize) {
    PricingPlan.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        badge: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        price: {
            // Texte libre : permet "990", "2 490" ou "Sur devis" sans contrainte numérique.
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: 'FCFA',
        },
        period: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        features: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        highlighted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        ctaText: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        ctaLink: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        isPublic: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        orderIndex: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        sequelize,
        tableName: 'pricing_plans',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    });
    return PricingPlan;
}
