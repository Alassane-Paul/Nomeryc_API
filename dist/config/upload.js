"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.isS3Storage = exports.UPLOAD_DIR = void 0;
exports.formatUploadedFile = formatUploadedFile;
exports.formatFileSize = formatFileSize;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const env_1 = require("./env");
exports.UPLOAD_DIR = path_1.default.resolve(process.cwd(), env_1.env.UPLOAD_DIR);
// Crée le dossier d'upload local au démarrage, même en mode S3 (utile pour les logs/PDF temporaires).
if (!fs_1.default.existsSync(exports.UPLOAD_DIR)) {
    fs_1.default.mkdirSync(exports.UPLOAD_DIR, { recursive: true });
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
exports.isS3Storage = env_1.env.STORAGE_DRIVER === 's3';
function randomFilename(originalname) {
    const ext = path_1.default.extname(originalname).toLowerCase().slice(0, 10);
    const unique = `${Date.now()}-${crypto_1.default.randomBytes(8).toString('hex')}`;
    return `${unique}${ext}`;
}
let s3Client = null;
function getS3Client() {
    if (!env_1.env.S3_BUCKET || !env_1.env.S3_ACCESS_KEY_ID || !env_1.env.S3_SECRET_ACCESS_KEY) {
        throw new Error('STORAGE_DRIVER=s3 mais S3_BUCKET / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY manquent dans .env.');
    }
    if (!s3Client) {
        s3Client = new client_s3_1.S3Client({
            region: env_1.env.S3_REGION || 'auto',
            credentials: { accessKeyId: env_1.env.S3_ACCESS_KEY_ID, secretAccessKey: env_1.env.S3_SECRET_ACCESS_KEY },
            ...(env_1.env.S3_ENDPOINT ? { endpoint: env_1.env.S3_ENDPOINT, forcePathStyle: true } : {}),
        });
    }
    return s3Client;
}
/** URL publique d'un fichier, quel que soit le driver actif. */
function publicUrlFor(filename) {
    if (exports.isS3Storage) {
        if (env_1.env.S3_PUBLIC_URL)
            return `${env_1.env.S3_PUBLIC_URL.replace(/\/$/, '')}/${filename}`;
        if (env_1.env.S3_ENDPOINT)
            return `${env_1.env.S3_ENDPOINT.replace(/\/$/, '')}/${env_1.env.S3_BUCKET}/${filename}`;
        return `https://${env_1.env.S3_BUCKET}.s3.${env_1.env.S3_REGION}.amazonaws.com/${filename}`;
    }
    return `${env_1.env.APP_URL}/uploads/${filename}`;
}
const storage = exports.isS3Storage
    ? (0, multer_s3_1.default)({
        s3: getS3Client(),
        bucket: env_1.env.S3_BUCKET,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (_req, file, cb) => cb(null, randomFilename(file.originalname)),
    })
    : multer_1.default.diskStorage({
        destination: (_req, _file, cb) => cb(null, exports.UPLOAD_DIR),
        filename: (_req, file, cb) => cb(null, randomFilename(file.originalname)),
    });
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: env_1.env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
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
function formatUploadedFile(file) {
    const filename = exports.isS3Storage ? file.key : file.filename;
    return {
        name: file.originalname,
        url: exports.isS3Storage ? file.location || publicUrlFor(filename) : publicUrlFor(filename),
        size: formatFileSize(file.size),
        type: file.mimetype,
        // conservé pour permettre la suppression ultérieure (clé S3 ou nom de fichier local)
        storageKey: filename,
    };
}
function formatFileSize(bytes) {
    if (bytes < 1024)
        return `${bytes} o`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
