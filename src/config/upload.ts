import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { env } from './env';

export const UPLOAD_DIR = path.resolve(process.cwd(), env.UPLOAD_DIR);

// Crée le dossier d'upload local au démarrage, même en mode S3 (utile pour les logs/PDF temporaires).
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
];

export const isS3Storage = env.STORAGE_DRIVER === 's3';

function randomFilename(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase().slice(0, 10);
  const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  return `${unique}${ext}`;
}

let s3Client: S3Client | null = null;
function getS3Client(): S3Client {
  if (!env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    throw new Error('STORAGE_DRIVER=s3 mais S3_BUCKET / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY manquent dans .env.');
  }
  if (!s3Client) {
    s3Client = new S3Client({
      region: env.S3_REGION || 'auto',
      credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
      ...(env.S3_ENDPOINT ? { endpoint: env.S3_ENDPOINT, forcePathStyle: true } : {}),
    });
  }
  return s3Client;
}

/** URL publique d'un fichier, quel que soit le driver actif. */
function publicUrlFor(filename: string): string {
  if (isS3Storage) {
    if (env.S3_PUBLIC_URL) return `${env.S3_PUBLIC_URL.replace(/\/$/, '')}/${filename}`;
    if (env.S3_ENDPOINT) return `${env.S3_ENDPOINT.replace(/\/$/, '')}/${env.S3_BUCKET}/${filename}`;
    return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${filename}`;
  }
  return `${env.APP_URL}/uploads/${filename}`;
}

const storage = isS3Storage
  ? multerS3({
      s3: getS3Client(),
      bucket: env.S3_BUCKET!,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (_req, file, cb) => cb(null, randomFilename(file.originalname)),
    })
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
      filename: (_req, file, cb) => cb(null, randomFilename(file.originalname)),
    });

export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(`Type de fichier non autorisé : ${file.mimetype}`));
    }
    cb(null, true);
  },
});

/** Formate un fichier multer (disque OU S3) en objet exploitable côté client. */
export function formatUploadedFile(file: Express.Multer.File & { key?: string; location?: string }) {
  const filename = isS3Storage ? file.key! : file.filename;
  return {
    name: file.originalname,
    url: isS3Storage ? file.location || publicUrlFor(filename) : publicUrlFor(filename),
    size: formatFileSize(file.size),
    type: file.mimetype,
    // conservé pour permettre la suppression ultérieure (clé S3 ou nom de fichier local)
    storageKey: filename,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
