import { BlogPost } from '../../../models/blogPost.model';
import { User } from '../../../models/user.model';
import { BlogPostStatus } from '../../../enums/blogPost.enum';

export async function getPostsService(query: { category?: unknown; search?: unknown }) {
  const where: any = { status: BlogPostStatus.PUBLIE };
  if (query.category) where.category = query.category;

  const posts = await BlogPost.findAll({
    where,
    include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
    attributes: { exclude: ['content'] },
    order: [['publishedAt', 'DESC']],
  });

  return query.search
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(String(query.search).toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(String(query.search).toLowerCase())),
      )
    : posts;
}
