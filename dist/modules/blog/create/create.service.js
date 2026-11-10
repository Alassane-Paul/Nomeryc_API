"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostService = createPostService;
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
async function createPostService(body, authorId) {
    const { title, ...rest } = body;
    const slug = generateSlug(title);
    return blogPost_model_1.BlogPost.create({
        ...rest,
        title,
        slug,
        authorId,
        status: body.status || blogPost_enum_1.BlogPostStatus.BROUILLON,
        publishedAt: body.status === blogPost_enum_1.BlogPostStatus.PUBLIE ? new Date() : undefined,
    });
}
