import fs from 'fs';
import path from 'path';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UPLOAD_DIR, isS3Storage } from '../../../config/upload';
import { env } from '../../../config/env';

export async function deleteUpload(filename: string) {
  const key = path.basename(filename);
  if (isS3Storage) {
    const client = new S3Client({
      region: env.S3_REGION || 'auto',
      credentials: { accessKeyId: env.S3_ACCESS_KEY_ID!, secretAccessKey: env.S3_SECRET_ACCESS_KEY! },
      ...(env.S3_ENDPOINT ? { endpoint: env.S3_ENDPOINT, forcePathStyle: true } : {}),
    });
    await client.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET!, Key: key }));
    return true;
  }

  const filePath = path.join(UPLOAD_DIR, key);
  if (!filePath.startsWith(UPLOAD_DIR) || !fs.existsSync(filePath)) return false;
  await fs.promises.unlink(filePath);
  return true;
}
