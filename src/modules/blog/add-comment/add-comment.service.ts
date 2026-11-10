import { BlogPost } from '../../../models/blogPost.model';
import { BlogPostStatus } from '../../../enums/blogPost.enum';

export async function addCommentService(slug: string, body: any) {
  const post = await BlogPost.findOne({ where: { slug, status: BlogPostStatus.PUBLIE } });
  if (!post) return { error: 'not-found' as const };

  const { authorName, authorEmail, content } = body;
  if (!authorName || !content) return { error: 'invalid' as const };

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
