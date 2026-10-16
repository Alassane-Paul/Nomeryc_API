import { Router } from 'express';
import { getPosts, getPost, getAllPosts, createPost, updatePost, deletePost, addComment } from './blog.controller';
import { authMiddleware, authorizationMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user.enum';

const blogRouter = Router();

// Routes publiques
blogRouter.get('/', getPosts);
blogRouter.get('/:slug', getPost);
blogRouter.post('/:slug/comment', addComment);

// Routes Admin
blogRouter.get('/admin/all', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), getAllPosts);
blogRouter.post('/', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), createPost);
blogRouter.patch('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), updatePost);
blogRouter.delete('/:id', authMiddleware, authorizationMiddleware([UserRole.ADMIN]), deletePost);

export default blogRouter;
