// Statuts de blog
export enum BlogPostStatus {
  BROUILLON = 'brouillon',
  PUBLIE = 'publie',
  PLANIFIE = 'planifie',
}

export type BlogPostStatusValue = `${BlogPostStatus}`;
