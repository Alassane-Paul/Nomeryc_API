import { Response, Request } from 'express';
import { BlogPost } from '../../models/blogPost.model';
import { User } from '../../models/user.model';
import { sendResponse, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../middlewares/errorHandler';
import { UserRole } from '../../enums/user.enum';
import { BlogPostStatus } from '../../enums/blogPost.enum';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/v1/blog (public - published only)
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { category, tag, search } = req.query;
  const where: any = { status: BlogPostStatus.PUBLIE };

  if (category) where.category = category;

  const posts = await BlogPost.findAll({
    where,
    include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
    attributes: { exclude: ['content'] },
    order: [['publishedAt', 'DESC']],
  });

  const filtered = search
    ? posts.filter(p => p.title.toLowerCase().includes(String(search).toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(String(search).toLowerCase())))
    : posts;

  return sendResponse(res, { data: filtered });
});

// GET /api/v1/blog/admin (admin - all posts)
export const getAllPosts = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const posts = await BlogPost.findAll({
    include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
    order: [['createdAt', 'DESC']],
  });
  return sendResponse(res, { data: posts });
});

// GET /api/v1/blog/:slug (public)
export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, status: BlogPostStatus.PUBLIE },
    include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
  });

  if (!post) return sendError(res, '30', 'Article non trouvé');

  // Incrémenter les vues
  await post.update({ views: (post.views || 0) + 1 });
  return sendResponse(res, { data: post });
});

// POST /api/v1/blog (Admin)
export const createPost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, ...rest } = req.body;
  const slug = generateSlug(title);

  const post = await BlogPost.create({
    ...rest,
    title,
    slug,
    authorId: req.user!.id,
    status: req.body.status || BlogPostStatus.BROUILLON,
    publishedAt: req.body.status === BlogPostStatus.PUBLIE ? new Date() : undefined,
  });

  return sendResponse(res, { responseCode: '01', data: post });
});

// PATCH /api/v1/blog/:id (Admin)
export const updatePost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const post = await BlogPost.findByPk(String(req.params.id));
  if (!post) return sendError(res, '30', 'Article non trouvé');

  if (req.body.title && req.body.title !== post.title) {
    req.body.slug = generateSlug(req.body.title);
  }

  if (req.body.status === BlogPostStatus.PUBLIE && !post.publishedAt) {
    req.body.publishedAt = new Date();
  }

  await post.update(req.body);
  return sendResponse(res, { responseCode: '02', data: post });
});

// DELETE /api/v1/blog/:id (Admin)
export const deletePost = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const post = await BlogPost.findByPk(String(req.params.id));
  if (!post) return sendError(res, '30', 'Article non trouvé');
  await post.destroy();
  return sendResponse(res, { responseCode: '03', data: null });
});

// POST /api/v1/blog/:slug/comment (public)
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({ where: { slug: req.params.slug, status: BlogPostStatus.PUBLIE } });
  if (!post) return sendError(res, '30', 'Article non trouvé');

  const { authorName, authorEmail, content } = req.body;
  if (!authorName || !content) return sendError(res, '11', 'Nom et commentaire requis');

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
  return sendResponse(res, { responseCode: '01', responseMessage: 'Commentaire soumis pour modération', data: newComment });
});
