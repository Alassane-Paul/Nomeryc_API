// Statuts de facture
export enum InvoiceStatus {
  BROUILLON = 'brouillon',
  ENVOYE = 'envoye',
  PAYE = 'paye',
  PARTIELLEMENT_PAYE = 'partiellement_paye',
  EN_RETARD = 'en_retard',
  ANNULE = 'annule',
}

// Méthodes de paiement
export enum PaymentMethod {
  VIREMENT = 'virement',
  CARTE = 'carte',
  PAYPAL = 'paypal',
  CHEQUE = 'cheque',
  MOBILE_MONEY = 'mobile_money',
  ESPECES = 'especes',
  AUTRE = 'autre',
}

export type InvoiceStatusValue = `${InvoiceStatus}`;
export type PaymentMethodValue = `${PaymentMethod}`;
