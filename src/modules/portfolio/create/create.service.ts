import { PortfolioItem } from '../../../models/portfolioItem.model';

export async function createPortfolioItemService(body: any) {
  return PortfolioItem.create(body);
}
