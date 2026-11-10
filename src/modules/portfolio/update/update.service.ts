import { PortfolioItem } from '../../../models/portfolioItem.model';

export async function updatePortfolioItemService(id: string, body: any) {
  const item = await PortfolioItem.findByPk(id);
  if (!item) return null;
  await item.update(body);
  return item;
}
