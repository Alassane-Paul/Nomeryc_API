"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsService = getPostsService;
const blogPost_model_1 = require("../../../models/blogPost.model");
const user_model_1 = require("../../../models/user.model");
const blogPost_enum_1 = require("../../../enums/blogPost.enum");
async function getPostsService(query) {
    const where = { status: blogPost_enum_1.BlogPostStatus.PUBLIE };
    if (query.category)
        where.category = query.category;
    const posts = await blogPost_model_1.BlogPost.findAll({
        where,
        include: [{ model: user_model_1.User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
        attributes: { exclude: ['content'] },
        order: [['publishedAt', 'DESC']],
    });
    return query.search
        ? posts.filter((post) => post.title.toLowerCase().includes(String(query.search).toLowerCase()) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(String(query.search).toLowerCase())))
        : posts;
}
