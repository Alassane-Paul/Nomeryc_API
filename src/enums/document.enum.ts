// Catégories de documents de l'espace client
export enum DocumentCategory {
  CONTRAT = 'contrat',
  FACTURE = 'facture',
  MAQUETTE = 'maquette',
  LIVRABLE = 'livrable',
  AUTRE = 'autre',
}

export type DocumentCategoryValue = `${DocumentCategory}`;
