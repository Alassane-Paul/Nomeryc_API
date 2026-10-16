// Rôles utilisateur
export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  UTILISATEUR = 'utilisateur',
}

export type UserRoleType = `${UserRole}`;
