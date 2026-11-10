"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostService = updatePostService;
const blogPost_model_1 = require("../../../models/blogPost.model");
const blogPost_enum_1 = require("../../../enums/blogPost.enum");
function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
async function updatePostService(id, body) {
    const post = await blogPost_model_1.BlogPost.findByPk(id);
    if (!post)
        return null;
    if (body.title && body.title !== post.title) {
        body.slug = generateSlug(body.title);
    }
    if (body.status === blogPost_enum_1.BlogPostStatus.PUBLIE && !post.publishedAt) {
        body.publishedAt = new Date();
    }
    await post.update(body);
    return post;
}
