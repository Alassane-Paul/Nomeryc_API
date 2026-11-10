import { BlogPost } from '../../../models/blogPost.model';
import { User } from '../../../models/user.model';

export async function getAllPostsService() {
  return BlogPost.findAll({
    include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
    order: [['createdAt', 'DESC']],
  });
}
