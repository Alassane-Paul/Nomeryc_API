"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUpload = deleteUpload;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const upload_1 = require("../../../config/upload");
const env_1 = require("../../../config/env");
async function deleteUpload(filename) {
    const key = path_1.default.basename(filename);
    if (upload_1.isS3Storage) {
        const client = new client_s3_1.S3Client({
            region: env_1.env.S3_REGION || 'auto',
            credentials: { accessKeyId: env_1.env.S3_ACCESS_KEY_ID, secretAccessKey: env_1.env.S3_SECRET_ACCESS_KEY },
            ...(env_1.env.S3_ENDPOINT ? { endpoint: env_1.env.S3_ENDPOINT, forcePathStyle: true } : {}),
        });
        await client.send(new client_s3_1.DeleteObjectCommand({ Bucket: env_1.env.S3_BUCKET, Key: key }));
        return true;
    }
    const filePath = path_1.default.join(upload_1.UPLOAD_DIR, key);
    if (!filePath.startsWith(upload_1.UPLOAD_DIR) || !fs_1.default.existsSync(filePath))
        return false;
    await fs_1.default.promises.unlink(filePath);
    return true;
}
