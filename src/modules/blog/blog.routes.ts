import { Router } from 'express';
import { getPosts } from './list/list.controller';
import { getAllPosts } from './admin-list/admin-list.controller';
import { getPost } from './get/get.controller';
import { createPost } from './create/create.controller';
import { updatePost } from './update/update.controller';
import { deletePost } from './delete/delete.controller';
import { addComment } from './add-comment/add-comment.controller';
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
