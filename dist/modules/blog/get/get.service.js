"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostService = getPostService;
const blogPost_model_1 = require("../../../models/blogPost.model");
const user_model_1 = require("../../../models/user.model");
const blogPost_enum_1 = require("../../../enums/blogPost.enum");
async function getPostService(slug) {
    const post = await blogPost_model_1.BlogPost.findOne({
        where: { slug, status: blogPost_enum_1.BlogPostStatus.PUBLIE },
        include: [{ model: user_model_1.User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
    });
    if (post)
        await post.update({ views: (post.views || 0) + 1 });
    return post;
}
