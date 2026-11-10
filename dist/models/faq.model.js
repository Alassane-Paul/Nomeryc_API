"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = void 0;
exports.initFaqModel = initFaqModel;
const sequelize_1 = require("sequelize");
class Faq extends sequelize_1.Model {
    id;
    question;
    answer;
    isPublic;
    orderIndex;
    createdAt;
    updatedAt;
}
exports.Faq = Faq;
function initFaqModel(sequelize) {
    Faq.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        question: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
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
        tableName: 'faqs',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    });
    return Faq;
}
