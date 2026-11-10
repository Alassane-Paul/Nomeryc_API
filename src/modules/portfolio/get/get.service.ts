import { PortfolioItem } from '../../../models/portfolioItem.model';

export async function getPortfolioItemService(id: string) {
  return PortfolioItem.findByPk(id);
}
