import { BlogPost } from '../../../models/blogPost.model';
import { User } from '../../../models/user.model';
import { BlogPostStatus } from '../../../enums/blogPost.enum';

export async function getPostService(slug: string) {
  const post = await BlogPost.findOne({
    where: { slug, status: BlogPostStatus.PUBLIE },
    include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
  });

  if (post) await post.update({ views: (post.views || 0) + 1 });
  return post;
}
