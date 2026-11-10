"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
exports.initBlogPostModel = initBlogPostModel;
const sequelize_1 = require("sequelize");
const blogPost_enum_1 = require("../enums/blogPost.enum");
class BlogPost extends sequelize_1.Model {
    id;
    authorId;
    title;
    slug;
    content;
    excerpt;
    coverImage;
    tags;
    category;
    status;
    views;
    readTimeMinutes;
    comments;
    publishedAt;
    createdAt;
    updatedAt;
}
exports.BlogPost = BlogPost;
function initBlogPostModel(sequelize) {
    BlogPost.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        authorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        excerpt: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        coverImage: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        category: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(blogPost_enum_1.BlogPostStatus)),
            allowNull: false,
            defaultValue: blogPost_enum_1.BlogPostStatus.BROUILLON,
        },
        views: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        readTimeMinutes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        comments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'blog_posts',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            { unique: true, fields: ['slug'] },
            { fields: ['status'] },
            { fields: ['author_id'] },
        ],
    });
    return BlogPost;
}
