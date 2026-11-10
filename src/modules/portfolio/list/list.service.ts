import { PortfolioItem } from '../../../models/portfolioItem.model';

export async function listPortfolioService(query: any) {
  const { category, featured } = query;
  const where: any = { isPublic: true };
  if (category) where.category = category;
  if (featured === 'true') where.featured = true;
  return PortfolioItem.findAll({ where, order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']] });
}
