// Statuts de projet
export enum ProjectStatus {
  DEVIS = 'devis',
  EN_COURS = 'en_cours',
  REVISION = 'revision',
  TERMINE = 'termine',
  ANNULE = 'annule',
}

export type ProjectStatusValue = `${ProjectStatus}`;
