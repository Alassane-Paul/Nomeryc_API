import { BlogPost } from '../../../models/blogPost.model';

export async function deletePostService(id: string) {
  const post = await BlogPost.findByPk(id);
  if (!post) return false;
  await post.destroy();
  return true;
}
