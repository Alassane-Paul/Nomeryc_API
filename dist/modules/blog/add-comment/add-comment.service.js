"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentService = addCommentService;
const blogPost_model_1 = require("../../../models/blogPost.model");
const blogPost_enum_1 = require("../../../enums/blogPost.enum");
async function addCommentService(slug, body) {
    const post = await blogPost_model_1.BlogPost.findOne({ where: { slug, status: blogPost_enum_1.BlogPostStatus.PUBLIE } });
    if (!post)
        return { error: 'not-found' };
    const { authorName, authorEmail, content } = body;
    if (!authorName || !content)
        return { error: 'invalid' };
    const comment = {
        id: Date.now().toString(),
        authorName,
        authorEmail,
        content,
        createdAt: new Date(),
        approved: false,
    };
    const comments = [...(post.comments || []), comment];
    await post.update({ comments });
    return { comment };
}
