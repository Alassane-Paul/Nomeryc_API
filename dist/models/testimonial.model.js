"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
exports.initTestimonialModel = initTestimonialModel;
const sequelize_1 = require("sequelize");
class Testimonial extends sequelize_1.Model {
    id;
    name;
    role;
    content;
    initials;
    rating;
    isPublic;
    orderIndex;
    createdAt;
    updatedAt;
}
exports.Testimonial = Testimonial;
function initTestimonialModel(sequelize) {
    Testimonial.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        initials: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 5,
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
        tableName: 'testimonials',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [{ fields: ['is_public'] }, { fields: ['order_index'] }],
    });
    return Testimonial;
}
