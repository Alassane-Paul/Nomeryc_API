import { BlogPost } from '../../../models/blogPost.model';
import { BlogPostStatus } from '../../../enums/blogPost.enum';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function updatePostService(id: string, body: any) {
  const post = await BlogPost.findByPk(id);
  if (!post) return null;

  if (body.title && body.title !== post.title) {
    body.slug = generateSlug(body.title);
  }

  if (body.status === BlogPostStatus.PUBLIE && !post.publishedAt) {
    body.publishedAt = new Date();
  }

  await post.update(body);
  return post;
}
