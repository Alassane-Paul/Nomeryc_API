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

export async function createPostService(body: any, authorId: string) {
  const { title, ...rest } = body;
  const slug = generateSlug(title);

  return BlogPost.create({
    ...rest,
    title,
    slug,
    authorId,
    status: body.status || BlogPostStatus.BROUILLON,
    publishedAt: body.status === BlogPostStatus.PUBLIE ? new Date() : undefined,
  });
}
