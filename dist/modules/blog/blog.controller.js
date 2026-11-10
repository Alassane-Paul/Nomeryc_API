"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.deletePost = exports.updatePost = exports.createPost = exports.getPost = exports.getAllPosts = exports.getPosts = void 0;
const blogPost_model_1 = require("../../models/blogPost.model");
const user_model_1 = require("../../models/user.model");
const response_1 = require("../../utils/response");
const errorHandler_1 = require("../../middlewares/errorHandler");
const blogPost_enum_1 = require("../../enums/blogPost.enum");
function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
// GET /api/v1/blog (public - published only)
exports.getPosts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { category, tag, search } = req.query;
    const where = { status: blogPost_enum_1.BlogPostStatus.PUBLIE };
    if (category)
        where.category = category;
    const posts = await blogPost_model_1.BlogPost.findAll({
        where,
        include: [{ model: user_model_1.User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
        attributes: { exclude: ['content'] },
        order: [['publishedAt', 'DESC']],
    });
    const filtered = search
        ? posts.filter(p => p.title.toLowerCase().includes(String(search).toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(String(search).toLowerCase())))
        : posts;
    return (0, response_1.sendResponse)(res, { data: filtered });
});
// GET /api/v1/blog/admin (admin - all posts)
exports.getAllPosts = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const posts = await blogPost_model_1.BlogPost.findAll({
        include: [{ model: user_model_1.User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
        order: [['createdAt', 'DESC']],
    });
    return (0, response_1.sendResponse)(res, { data: posts });
});
// GET /api/v1/blog/:slug (public)
exports.getPost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const post = await blogPost_model_1.BlogPost.findOne({
        where: { slug: req.params.slug, status: blogPost_enum_1.BlogPostStatus.PUBLIE },
        include: [{ model: user_model_1.User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
    });
    if (!post)
        return (0, response_1.sendError)(res, '30', 'Article non trouvé');
    // Incrémenter les vues
    await post.update({ views: (post.views || 0) + 1 });
    return (0, response_1.sendResponse)(res, { data: post });
});
// POST /api/v1/blog (Admin)
exports.createPost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, ...rest } = req.body;
    const slug = generateSlug(title);
    const post = await blogPost_model_1.BlogPost.create({
        ...rest,
        title,
        slug,
        authorId: req.user.id,
        status: req.body.status || blogPost_enum_1.BlogPostStatus.BROUILLON,
        publishedAt: req.body.status === blogPost_enum_1.BlogPostStatus.PUBLIE ? new Date() : undefined,
    });
    return (0, response_1.sendResponse)(res, { responseCode: '01', data: post });
});
// PATCH /api/v1/blog/:id (Admin)
exports.updatePost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const post = await blogPost_model_1.BlogPost.findByPk(String(req.params.id));
    if (!post)
        return (0, response_1.sendError)(res, '30', 'Article non trouvé');
    if (req.body.title && req.body.title !== post.title) {
        req.body.slug = generateSlug(req.body.title);
    }
    if (req.body.status === blogPost_enum_1.BlogPostStatus.PUBLIE && !post.publishedAt) {
        req.body.publishedAt = new Date();
    }
    await post.update(req.body);
    return (0, response_1.sendResponse)(res, { responseCode: '02', data: post });
});
// DELETE /api/v1/blog/:id (Admin)
exports.deletePost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const post = await blogPost_model_1.BlogPost.findByPk(String(req.params.id));
    if (!post)
        return (0, response_1.sendError)(res, '30', 'Article non trouvé');
    await post.destroy();
    return (0, response_1.sendResponse)(res, { responseCode: '03', data: null });
});
// POST /api/v1/blog/:slug/comment (public)
exports.addComment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const post = await blogPost_model_1.BlogPost.findOne({ where: { slug: req.params.slug, status: blogPost_enum_1.BlogPostStatus.PUBLIE } });
    if (!post)
        return (0, response_1.sendError)(res, '30', 'Article non trouvé');
    const { authorName, authorEmail, content } = req.body;
    if (!authorName || !content)
        return (0, response_1.sendError)(res, '11', 'Nom et commentaire requis');
    const newComment = {
        id: Date.now().toString(),
        authorName,
        authorEmail,
        content,
        createdAt: new Date(),
        approved: false,
    };
    const comments = [...(post.comments || []), newComment];
    await post.update({ comments });
    return (0, response_1.sendResponse)(res, { responseCode: '01', responseMessage: 'Commentaire soumis pour modération', data: newComment });
});
