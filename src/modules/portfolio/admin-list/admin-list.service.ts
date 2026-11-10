import { PortfolioItem } from '../../../models/portfolioItem.model';

export async function listAllPortfolioService() {
  return PortfolioItem.findAll({ order: [['orderIndex', 'ASC']] });
}
