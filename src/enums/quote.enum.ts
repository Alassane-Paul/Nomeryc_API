// Statuts de devis
export enum QuoteStatus {
  BROUILLON = 'brouillon',
  ENVOYE = 'envoye',
  ACCEPTE = 'accepte',
  REFUSE = 'refuse',
  EXPIRE = 'expire',
}

// Types de remise
export enum DiscountType {
  POURCENTAGE = 'pourcentage',
  FIXE = 'fixe',
}

export type QuoteStatusValue = `${QuoteStatus}`;
export type DiscountTypeValue = `${DiscountType}`;
