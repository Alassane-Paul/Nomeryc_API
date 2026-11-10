import { PortfolioItem } from '../../../models/portfolioItem.model';

export async function deletePortfolioItemService(id: string) {
  const item = await PortfolioItem.findByPk(id);
  if (!item) return false;
  await item.destroy();
  return true;
}
