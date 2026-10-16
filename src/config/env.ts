import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  // Database
  DB_DIALECT: string;
  DB_HOST?: string;
  DB_PORT?: number;
  DB_NAME?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_STORAGE?: string;
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  // SMTP
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_SECURE?: boolean;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  SMTP_FROM?: string;
  // URLs
  FRONTEND_URL: string;
  CORS_ORIGIN: string;
  // Stripe
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  // FedaPay (Mobile Money)
  FEDAPAY_SECRET_KEY?: string;
  FEDAPAY_ENVIRONMENT: string;
  FEDAPAY_WEBHOOK_SECRET?: string;
  // Redis (scalabilité Socket.IO multi-instance — optionnel)
  REDIS_URL?: string;
  // Stockage fichiers : 'local' (disque, par défaut) ou 's3' (AWS S3 / Cloudflare R2 / tout endpoint compatible S3)
  STORAGE_DRIVER: string;
  S3_BUCKET?: string;
  S3_REGION?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
  S3_ENDPOINT?: string; // laisser vide pour AWS S3 ; renseigner pour R2/MinIO/autre
  S3_PUBLIC_URL?: string; // URL publique de base si différente de l'endpoint (ex. domaine CDN R2)
  // Uploads
  UPLOAD_DIR: string;
  MAX_UPLOAD_SIZE_MB: number;
  APP_URL: string;
}

export const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  // Database
  DB_DIALECT: process.env.DB_DIALECT || 'sqlite',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_STORAGE: process.env.DB_STORAGE,
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'nomeryc-super-secure-jwt-secret-2026',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',
  // SMTP
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@nomeryc.com',
  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  // FedaPay (Mobile Money)
  FEDAPAY_SECRET_KEY: process.env.FEDAPAY_SECRET_KEY,
  FEDAPAY_ENVIRONMENT: process.env.FEDAPAY_ENVIRONMENT || 'sandbox',
  FEDAPAY_WEBHOOK_SECRET: process.env.FEDAPAY_WEBHOOK_SECRET,
  // Redis
  REDIS_URL: process.env.REDIS_URL,
  // Stockage
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
  S3_BUCKET: process.env.S3_BUCKET,
  S3_REGION: process.env.S3_REGION || 'auto',
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
  // Uploads
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_UPLOAD_SIZE_MB: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10'),
  APP_URL: process.env.APP_URL || `http://localhost:${process.env.PORT || '5000'}`,
};

export default env;
