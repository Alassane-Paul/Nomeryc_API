"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioItem = void 0;
exports.initPortfolioItemModel = initPortfolioItemModel;
const sequelize_1 = require("sequelize");
class PortfolioItem extends sequelize_1.Model {
    id;
    title;
    description;
    category;
    images;
    coverImage;
    technologies;
    clientName;
    liveUrl;
    featured;
    isPublic;
    orderIndex;
    createdAt;
    updatedAt;
}
exports.PortfolioItem = PortfolioItem;
function initPortfolioItemModel(sequelize) {
    PortfolioItem.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            // Chaîne libre (et non un enum) : ce sont les catégories affichées dans le
            // filtre du portfolio public (ex. 'web', 'mobile', 'design', 'marketing'),
            // distinctes des ServiceType utilisés pour les devis/projets. Laisser en
            // texte libre permet à l'admin d'ajouter une catégorie depuis le back-office
            // sans qu'un développeur ait à modifier un enum côté code.
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: 'web',
        },
        images: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        coverImage: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        technologies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        clientName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        liveUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        featured: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
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
        tableName: 'portfolio_items',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { fields: ['category'] },
            { fields: ['is_public'] },
            { fields: ['featured'] },
        ],
    });
    return PortfolioItem;
}
