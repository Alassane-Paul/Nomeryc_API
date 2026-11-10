"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterSubscriber = void 0;
exports.initNewsletterSubscriberModel = initNewsletterSubscriberModel;
const sequelize_1 = require("sequelize");
class NewsletterSubscriber extends sequelize_1.Model {
    id;
    email;
    unsubscribeToken;
    isActive;
    createdAt;
    updatedAt;
}
exports.NewsletterSubscriber = NewsletterSubscriber;
function initNewsletterSubscriberModel(sequelize) {
    NewsletterSubscriber.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        unsubscribeToken: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: 'newsletter_subscribers',
        timestamps: true,
        underscored: true,
        indexes: [{ unique: true, fields: ['email'] }],
    });
    return NewsletterSubscriber;
}
