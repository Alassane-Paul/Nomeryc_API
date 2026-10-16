// Types de service Nomeryc
export enum ServiceType {
  WEB = 'web',
  APPS = 'apps',
  AUDIT = 'audit',
  DESIGN = 'design',
  BOT = 'bot',
}

export type ServiceTypeValue = `${ServiceType}`;
